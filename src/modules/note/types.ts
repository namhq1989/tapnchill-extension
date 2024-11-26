export interface INoteStore {
  notes: INote[]
  notesHasFetched: boolean

  openCreateNoteView: (
    pageText: string,
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
  updatedAt: Date
}

export interface INoteData {
  pageText: string
  pageUrl: string
  pageTitle: string
}

export interface ICreateNoteApiRequest {
  title: string
  description: string
  data: INoteData | null
}

export interface ICreateNoteApiResponse {
  id: string
}

export interface IUpdateNoteApiRequest {
  title: string
  description: string
  data: INoteData
}

export interface IUpdateNoteApiResponse {
  id: string
}

export interface IDeleteNoteApiResponse {
  id: string
}
