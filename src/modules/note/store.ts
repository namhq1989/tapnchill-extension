import { create } from 'zustand'
import {
  ICreateNoteApiRequest,
  ICreateNoteApiResponse,
  IDeleteNoteApiResponse,
  INote,
  INoteData,
  INoteStore,
  IUpdateNoteApiRequest,
  IUpdateNoteApiResponse,
} from '@/modules/note/types.ts'
import { goTo } from 'react-chrome-extension-router'
import NoteCreateView from '@/modules/note/note-create.tsx'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const useNoteStore = create<INoteStore>((set, get) => ({
  notes: [],
  notesHasFetched: false,

  openCreateNoteView: (
    pageText: string,
    pageUrl: string,
    pageTitle: string,
  ) => {
    goTo(NoteCreateView, { pageText, pageTitle, pageUrl })
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

      const { notes } = get()
      notes.unshift(newNote)
      set({ notes })

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

      const { notes } = get()
      set({
        notes: notes.map((n) => (n.id === note.id ? note : n)),
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
