export interface INoteStore {
  notes: []
  notesHasFetched: boolean

  openCreateNoteView: (
    selectedText: string,
    pageUrl: string,
    pageTitle: string,
  ) => void

  createNote(
    title: string,
    description: string,
    data: INoteData | null,
  ): Promise<boolean>
  updateNote(note: INote): Promise<boolean>
  deleteNote(note: INote): Promise<boolean>
}

export interface INote {
  id: string
  title: string
  description: string
  data: INoteData | null
  createdAt: Date
}

export interface INoteData {
  text: string
  pageUrl: string
  pageTitle: string
}
