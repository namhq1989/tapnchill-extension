export interface INoteStore {
  notes: INote[]
  page: number
  pageSize: number

  openCreateNoteView: (
    pageText: string,
    pageUrl: string,
    pageTitle: string,
  ) => void

  getMostRecentNote(db: IDBDatabase): Promise<INote | null>

  syncNotes(): Promise<void>
  fetchNotes(): Promise<void>
  createNote(
    title: string,
    description: string,
    data: INoteData | null,
  ): Promise<boolean>
  updateNote(note: INote): Promise<boolean>
  deleteNote(note: INote): Promise<boolean>

  countCurrentPageNotes(url: string): Promise<number>
}

export interface INote {
  id: string
  title: string
  description: string
  data: INoteData | null
  createdAt: Date
  updatedAt: Date
}

export interface INoteApiData {
  id: string
  title: string
  description: string
  data: INoteData | null
  createdAt: string
  updatedAt: string
}

export interface INoteData {
  pageText: string
  pageUrl: string
  pageTitle: string
  pageDomain?: string
}

export interface ISyncNotesApiRequest {
  lastUpdatedAt: string
}

export interface ISyncNotesApiResponse {
  notes: INoteApiData[]
  limit: number
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
