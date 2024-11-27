import { ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import useNoteStore from '@/modules/note/store.ts'
import { useEffect } from 'react'
import { INote } from '@/modules/note/types.ts'
import { format } from 'date-fns'
import NoteCreateView from '@/modules/note/note-create.tsx'

const NoteView = () => {
  const { initApp, isInitializing, notes, syncNotes, fetchNotes } =
    useNoteStore()

  useEffect(() => {
    const fetch = async () => {
      await initApp()
      await syncNotes()
      await fetchNotes()
    }

    fetch().then()
  }, [initApp, syncNotes, fetchNotes])

  if (isInitializing) {
    return null
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 pr-6 border-b-[1px]'>
        <h2 className='text-base text-primary font-bold tracking-wide'>
          Notes
        </h2>
        <Link component={NoteCreateView}>
          <Plus className='cursor-pointer text-primary' />
        </Link>
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex flex-col gap-2'>
          {notes.length === 0 && (
            <div className='flex flex-col gap-2 items-center py-4 mb-4'>
              <p className='text-base text-muted-foreground'>
                You don't have any notes yet!
              </p>
            </div>
          )}
          {notes.map((note) => (
            <NoteItem key={`note-${note.id}`} note={note} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface INoteItemProps {
  note: INote
}

const NoteItem = (props: INoteItemProps) => {
  const { note } = props

  return (
    <div className='flex flex-row items-center justify-between container-selected p-4 rounded-xl gap-4'>
      <div className='flex flex-col gap-2'>
        <p className='text-sm text-muted-foreground'>
          {format(note.updatedAt, 'dd/MM/yyyy, HH:mm')}
        </p>
        <div className='flex flex-col gap-1'>
          <p className='text-base'>{note.title}</p>
        </div>
      </div>
      <Link component={NoteCreateView} props={{ note }}>
        <ChevronRight strokeWidth={1} className='cursor-pointer' />
      </Link>
    </div>
  )
}

export default NoteView
