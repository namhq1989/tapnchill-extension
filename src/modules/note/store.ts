import { create } from 'zustand'
import { INoteStore } from '@/modules/note/types.ts'

const useNoteStore = create<INoteStore>((set) => ({
  isCreateNoteDialogOpen: false,
  openCreateNoteDialog: (
    selectedText: string,
    pageUrl: string,
    title: string,
  ) => set({ isCreateNoteDialogOpen: true, selectedText, pageUrl, title }),
  closeCreateNoteDialog: () =>
    set({ isCreateNoteDialogOpen: false, selectedText: '' }),
  selectedText: '',
  setSelectedText: (selectedText: string) => set({ selectedText }),
  pageUrl: '',
  setPageUrl: (url: string) => set({ pageUrl: url }),
  title: '',
  setTitle: (title: string) => set({ title }),
}))

export default useNoteStore
