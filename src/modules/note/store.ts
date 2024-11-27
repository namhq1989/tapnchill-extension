import { create } from 'zustand'
import {
  ICreateNoteApiRequest,
  ICreateNoteApiResponse,
  IDeleteNoteApiResponse,
  INote,
  INoteData,
  INoteStore,
  ISyncNotesApiRequest,
  ISyncNotesApiResponse,
  IUpdateNoteApiRequest,
  IUpdateNoteApiResponse,
} from '@/modules/note/types.ts'
import { goTo } from 'react-chrome-extension-router'
import NoteCreateView from '@/modules/note/note-create.tsx'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { mapNotes } from '@/modules/note/util.ts'
import { getDomain } from '@/lib/string.ts'

const INDEXEDDB_NAME = 'notes'
const SYNC_NOTES_INTERVAL = 3600000 // 1 hour

const openIndexedDB = async (): Promise<IDBDatabase> => {
  const dbName = 'NotesDB'
  const dbVersion = 2

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion)

    request.onupgradeneeded = (event) => {
      const db = request.result
      const { oldVersion } = event

      if (oldVersion < 1) {
        const store = db.createObjectStore(INDEXEDDB_NAME, { keyPath: 'id' })
        store.createIndex('updatedAtIndex', 'updatedAt', { unique: false })
      } else if (oldVersion < 2) {
        const store = request.transaction?.objectStore(INDEXEDDB_NAME)
        if (store && !store.indexNames.contains('pageDomainIndex')) {
          store.createIndex('pageDomainIndex', 'data.pageDomain', {
            unique: false,
          })
        }
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Failed to open IndexedDB'))
  })
}

const persistNotesInOrder = async (notes: INote[], db: IDBDatabase) => {
  if (!notes || notes.length === 0) {
    console.log('No notes to persist.')
    return
  }

  const sortedNotes = notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
  const store = tx.objectStore(INDEXEDDB_NAME)

  for (const note of sortedNotes) {
    store.put(note)
  }

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => {
      // console.log(
      //   'Notes successfully persisted in IndexedDB in updatedAt DESC order.',
      // )
      resolve()
    }
    tx.onerror = () =>
      reject(new Error('Failed to persist notes in IndexedDB.'))
  })
}

const useNoteStore = create<INoteStore>((set, get) => ({
  notes: [],
  page: 0,
  pageSize: 20,

  openCreateNoteView: (
    pageText: string,
    pageUrl: string,
    pageTitle: string,
  ) => {
    goTo(NoteCreateView, { pageText, pageTitle, pageUrl })
  },

  getMostRecentNote: async (db: IDBDatabase) => {
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      const tx = db.transaction('notes', 'readonly')
      const store = tx.objectStore('notes')

      const index = store.index('updatedAtIndex')
      const request = index.openCursor(null, 'prev')

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor) {
            resolve(cursor.value)
          } else {
            resolve(null)
          }
        }
        request.onerror = () =>
          reject(new Error('Failed to fetch the most recent note'))
      })
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })
    }
    return null
  },
  syncNotes: async () => {
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      const db = await openIndexedDB()
      const { getMostRecentNote } = get()
      const data = await getMostRecentNote(db)

      if (
        data &&
        new Date().getTime() - data.updatedAt.getTime() < SYNC_NOTES_INTERVAL
      ) {
        return
      }

      let hasMoreData = true
      let currentUpdatedAt = data ? data.updatedAt.toISOString() : ''

      const { get: httpGet } = useHttpStore.getState()

      while (hasMoreData) {
        const response = await httpGet<ISyncNotesApiResponse>('api/note/sync', {
          lastUpdatedAt: currentUpdatedAt,
        } as ISyncNotesApiRequest)
        if (!response.notes.length) return

        const notes = mapNotes(response.notes)
        await persistNotesInOrder(notes, db)

        if (notes.length < response.limit) {
          hasMoreData = false
        } else {
          currentUpdatedAt = notes[notes.length - 1].updatedAt.toISOString()
        }
      }
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
      const db = await openIndexedDB()
      const tx = db.transaction(INDEXEDDB_NAME, 'readonly')
      const store = tx.objectStore(INDEXEDDB_NAME)
      const index = store.index('updatedAtIndex')

      const start = page * pageSize
      const end = start + pageSize

      let currentIndex = 0
      const fetchedNotes: INote[] = []

      const request = index.openCursor(null, 'prev')
      await new Promise<void>((resolve, reject) => {
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
          if (cursor && currentIndex < end) {
            if (currentIndex >= start) {
              fetchedNotes.push(cursor.value) // Add note within range
            }
            currentIndex++
            cursor.continue()
          } else {
            resolve()
          }
        }
        request.onerror = () => reject(new Error('Failed to fetch notes'))
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

      // const { notes } = get()
      // notes.unshift(newNote)
      // set({ notes })

      const db = await openIndexedDB() // Open IndexedDB
      const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
      const store = tx.objectStore(INDEXEDDB_NAME)

      await new Promise<void>((resolve, reject) => {
        const request = store.add(newNote)
        request.onsuccess = () => resolve()
        request.onerror = () =>
          reject(new Error('Failed to create note in IndexedDB.'))
      })

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

      // const { notes } = get()
      // set({
      //   notes: notes.map((n) => (n.id === note.id ? note : n)),
      // })

      const db = await openIndexedDB()
      const tx = db.transaction('notes', 'readwrite')
      const store = tx.objectStore('notes')

      await new Promise<void>((resolve, reject) => {
        const request = store.put(note)
        request.onsuccess = () => resolve()
        request.onerror = () =>
          reject(new Error('Failed to update note in IndexedDB.'))
      })

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

      const db = await openIndexedDB()
      const tx = db.transaction('notes', 'readwrite')
      const store = tx.objectStore('notes')

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(note.id) // Delete the note
        request.onsuccess = () => resolve()
        request.onerror = () =>
          reject(new Error('Failed to delete note in IndexedDB.'))
      })

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },

  countCurrentPageNotes: async (url): Promise<number> => {
    console.log('url', url)

    const domain = getDomain(url)
    if (!domain) {
      return 0
    }

    const db = await openIndexedDB()

    const tx = db.transaction('notes', 'readonly')
    const store = tx.objectStore('notes')
    const index = store.index('pageDomainIndex')

    const request = index.count(domain)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () =>
        reject(new Error('Failed to count notes for the pageDomain'))
    })
  },
}))

export default useNoteStore
