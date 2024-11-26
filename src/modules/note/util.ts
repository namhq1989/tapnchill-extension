import { INote, INoteApiData } from '@/modules/note/types.ts'

const mapNotes = (notes: INoteApiData[]): INote[] => {
  const result: INote[] = []
  for (const note of notes) {
    result.push({
      id: note.id,
      title: note.title,
      description: note.description,
      data: note.data,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    })
  }
  return result
}

export { mapNotes }
