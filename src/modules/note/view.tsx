import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { ChevronRight, ExternalLink, Plus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import NoteDetailView from '@/modules/note/note-detail.tsx'
import NoteCreateView from '@/modules/note/note-create.tsx'
import useNoteStore from '@/modules/note/store.ts'
import { useEffect } from 'react'
import { INote } from '@/modules/note/types.ts'
import { format } from 'date-fns'
import { getDomainForDisplaying } from '@/lib/string.ts'

const NoteView = () => {
  const { notes, syncNotes, fetchNotes } = useNoteStore()

  useEffect(() => {
    const fetch = async () => {
      await syncNotes()
      await fetchNotes()
    }

    fetch().then()
  }, [syncNotes, fetchNotes])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Notes' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex flex-row items-center justify-end'>
          {/*<div className='flex flex-row gap-2 items-center'>*/}
          {/*  <Input className='w-[150px] h-[32px]' />*/}
          {/*  <Button variant='secondary' className='h-[32px]'>*/}
          {/*    Search*/}
          {/*  </Button>*/}
          {/*</div>*/}
          <Link component={NoteCreateView}>
            <Plus className='cursor-pointer' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
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
    <div className='flex flex-col container-selected p-4 rounded-xl gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-sm font-bold'>
          {format(note.updatedAt, 'dd/MM/yyyy')}
        </p>
        <Link component={NoteDetailView} props={{ note }}>
          <ChevronRight strokeWidth={1} className='cursor-pointer' />
        </Link>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='text-xl font-bold'>{note.title}</p>
        <p className='text-sm text-muted-foreground'>{note.description}</p>
      </div>
      {note.data && note.data.pageUrl && (
        <a
          className='flex flex-row gap-2 w-full px-4 py-2 bg-background rounded-xl items-center cursor-pointer'
          href={note.data.pageUrl}
          target='_blank'
        >
          <ExternalLink strokeWidth={1} size={16} />
          <p className='text-sm'>{getDomainForDisplaying(note.data.pageUrl)}</p>
        </a>
      )}
    </div>
  )
}

export default NoteView
