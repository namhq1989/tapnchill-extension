import { INote, INoteApiData } from '@/modules/note/types.ts'
import { getDomain } from '@/lib/string.ts'

const mapNote = (note: INoteApiData): INote => {
  return {
    id: note.id,
    title: note.title,
    description: note.description,
    data: note.data
      ? {
          ...note.data,
          pageDomain: getDomain(note.data.pageUrl),
        }
      : null,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
  }
}

const mapNotes = (notes: INoteApiData[]): INote[] => {
  const result: INote[] = []
  for (const note of notes) {
    result.push(mapNote(note))
  }
  return result
}

export { mapNote, mapNotes }
