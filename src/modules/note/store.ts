import { create } from 'zustand'
import { INote, INoteData, INoteStore } from '@/modules/note/types.ts'
import { goTo } from 'react-chrome-extension-router'
import NoteCreateView from '@/modules/note/note-create.tsx'

const useNoteStore = create<INoteStore>(() => ({
  notes: [],
  notesHasFetched: false,

  openCreateNoteView: (
    selectedText: string,
    pageUrl: string,
    pageTitle: string,
  ) => {
    goTo(NoteCreateView, { selectedText, pageTitle, pageUrl })
  },

  createNote(
    title: string,
    description: string,
    data: INoteData | null,
  ): Promise<boolean> {
    return Promise.resolve(true)
  },

  updateNote(note: INote): Promise<boolean> {
    return Promise.resolve(true)
  },

  deleteNote(note: INote): Promise<boolean> {
    return Promise.resolve(true)
  },
}))

export default useNoteStore
