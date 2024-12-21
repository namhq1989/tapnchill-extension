import { create } from 'zustand'
import {
  ICreateNoteApiRequest,
  ICreateNoteApiResponse,
  IDeleteNoteApiResponse,
  INote,
  INoteData,
  INoteStore,
  ISyncNotesApiResponse,
  IUpdateNoteApiRequest,
  IUpdateNoteApiResponse,
} from '@/modules/note/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { mapNotes } from '@/modules/note/util.ts'

const SYNC_NOTES_INTERVAL = 3600000 // 1 hour

const useNoteStore = create<INoteStore>((set, get) => ({
  notes: [],
  page: 0,
  pageSize: 20,

  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })
    chrome.storage.local.get(async (result) => {
      const accessToken: string = result.accessToken || ''
      const { setAccessToken } = useHttpStore.getState()
      setAccessToken(accessToken)
      set({ isInitializing: false })
    })
  },

  currentNote: null,
  setCurrentNote: (note: INote | null) => {
    set({ currentNote: note })
  },

  syncNotes: async () => {
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      // Step 1: Get last sync timestamp from the background
      const lastSyncedAt = await new Promise<number>((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: 'get-notes-last-sync-at' },
          (response) => {
            if (chrome.runtime.lastError) {
              return reject(new Error('Failed to communicate with background.'))
            }
            if (response && response.success) {
              resolve(response.lastSyncedAt)
            } else {
              reject(new Error(response?.error || 'Unknown error occurred.'))
            }
          },
        )
      })

      // Step 2: Check if the sync interval has passed
      const now = Date.now()
      if (now - lastSyncedAt < SYNC_NOTES_INTERVAL) {
        console.log('Sync skipped due to interval threshold.')
        return
      }

      let currentUpdatedAt = ''

      const { get: httpGet } = useHttpStore.getState()

      while (true) {
        const response = await httpGet<ISyncNotesApiResponse>('api/note/sync', {
          lastUpdatedAt: currentUpdatedAt,
        })

        // Exit loop if no notes are returned
        if (!response.notes.length) {
          await new Promise<void>((resolve, reject) => {
            chrome.runtime.sendMessage(
              { type: 'update-notes-last-sync-at', lastSyncedAt: now },
              (response) => {
                console.log('response', response)
                if (chrome.runtime.lastError) {
                  return reject(
                    new Error('Failed to update sync timestamp in background.'),
                  )
                }
                if (response && response.success) {
                  resolve()
                } else {
                  reject(
                    new Error(response?.error || 'Unknown error occurred.'),
                  )
                }
              },
            )
          })
          break
        }

        const notes = mapNotes(response.notes)

        // Step 4: Persist notes in the background
        await new Promise<void>((resolve, reject) => {
          chrome.runtime.sendMessage(
            { type: 'persist-notes-with-order-in-indexeddb', payload: notes },
            (response) => {
              if (chrome.runtime.lastError) {
                return reject(
                  new Error('Failed to persist notes in background.'),
                )
              }
              if (response && response.success) {
                resolve()
              } else {
                reject(new Error(response?.error || 'Unknown error occurred.'))
              }
            },
          )
        })

        // Step 5: Update the current timestamp for the next batch
        currentUpdatedAt = notes[notes.length - 1].updatedAt.toISOString()

        // Exit if less than the limit, indicating no more data
        if (notes.length < response.limit) {
          break
        }
      }

      // Step 6: Update lastSyncedAt after completing all batches
      await new Promise<void>((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: 'update-notes-last-sync-at', lastSyncedAt: now },
          (response) => {
            if (chrome.runtime.lastError) {
              return reject(
                new Error('Failed to update sync timestamp in background.'),
              )
            }
            if (response && response.success) {
              resolve()
            } else {
              reject(new Error(response?.error || 'Unknown error occurred.'))
            }
          },
        )
      })
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })
    }
  },

  fetchNotes: async () => {
    const { showErrorNotification } = useNotificationStore.getState()
    const { page, pageSize, notes } = get()

    try {
      const fetchedNotes = await new Promise<INote[]>((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: 'fetch-notes-in-indexeddb', page, pageSize },
          (response) => {
            if (chrome.runtime.lastError) {
              return reject(new Error('Failed to communicate with background.'))
            }
            if (response && response.success) {
              resolve(response.notes)
            } else {
              reject(new Error(response?.error || 'Unknown error occurred.'))
            }
          },
        )
      })

      set({
        notes: [...notes, ...fetchedNotes],
        page: page + 1,
      })
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })
    }
  },

  createNote: async (
    title: string,
    description: string,
    data: INoteData | null,
  ): Promise<boolean> => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateNoteApiResponse>('api/note', {
        title,
        description,
        data,
      } as ICreateNoteApiRequest)

      showNotification({
        description: 'Note created successfully',
      })

      const newNote: INote = {
        id: response.id,
        title,
        description,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      chrome.runtime.sendMessage(
        {
          type: 'create-note-in-indexeddb',
          payload: newNote,
        },
        async (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              'Error sending message to background:',
              chrome.runtime.lastError.message,
            )
          } else if (!response.success) {
            console.error('Error creating note in IndexedDB:', response.error)
          }

          const { notes } = get()
          notes.unshift(newNote)
          set({ notes, currentNote: newNote })
        },
      )

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },

  updateNote: async (note: INote): Promise<boolean> => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<IUpdateNoteApiResponse>(`api/note/${note.id}`, {
        title: note.title,
        description: note.description,
        data: note.data,
      } as IUpdateNoteApiRequest)

      showNotification({
        description: 'Note updated successfully',
      })

      chrome.runtime.sendMessage(
        {
          type: 'update-note-in-indexeddb',
          payload: note,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              'Error sending message to background:',
              chrome.runtime.lastError.message,
            )
          } else if (!response.success) {
            console.error('Error creating note in IndexedDB:', response.error)
          }
        },
      )

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },

  deleteNote: async (note: INote): Promise<boolean> => {
    const { delete: httpDelete } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpDelete<IDeleteNoteApiResponse>(`api/note/${note.id}`, {})

      showNotification({
        description: 'Note deleted successfully',
      })

      const { notes } = get()
      set({
        notes: notes.filter((n) => n.id !== note.id),
      })

      chrome.runtime.sendMessage(
        {
          type: 'delete-note-in-indexeddb',
          payload: note,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              'Error sending message to background:',
              chrome.runtime.lastError.message,
            )
          } else if (!response.success) {
            console.error('Error creating note in IndexedDB:', response.error)
          }
        },
      )

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },
}))

export default useNoteStore
