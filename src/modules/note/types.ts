export interface INoteStore {
  isCreateNoteDialogOpen: boolean
  openCreateNoteDialog: (
    selectedText: string,
    pageUrl: string,
    title: string,
  ) => void
  closeCreateNoteDialog: () => void
  selectedText: string
  setSelectedText: (selectedText: string) => void
  pageUrl: string
  setPageUrl: (url: string) => void
  title: string
  setTitle: (title: string) => void
}
