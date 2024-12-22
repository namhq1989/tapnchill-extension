import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import { goTo } from 'react-chrome-extension-router'
import useNoteStore from '@/modules/note/store.ts'
import { useEffect } from 'react'
import { INote } from '@/modules/note/types.ts'
import { format } from 'date-fns'
import NoteCreateView from '@/modules/note/note-create.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import PanelMenuItem from '@/modules/panel/menu-item.tsx'

const NoteView = () => {
  const {
    initApp,
    isInitializing,
    setCurrentNote,
    notes,
    syncNotes,
    fetchNotes,
  } = useNoteStore()

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
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <ArrowLeft
          className='cursor-pointer'
          onClick={() => goTo(PanelMenuItem)}
        />
        <HeaderTitle title='Notes' />
      </div>
      <div className='flex flex-col w-full p-4 gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-base font-bold tracking-wide'>Recent Notes</h2>
            <Plus
              className='cursor-pointer'
              onClick={() => {
                setCurrentNote(null)
                goTo(NoteCreateView)
              }}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {notes.length === 0 && (
            <div className='flex flex-col gap-2 items-center py-4 my-8'>
              <img
                src='https://i.bapbi.app/illus-add-notes.svg'
                alt='empty'
                className='w-40 h-40 my-8'
              />
              <p className='text-base text-muted-foreground'>
                You don't have any Notes yet!
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
  const { setCurrentNote } = useNoteStore()
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
      <ChevronRight
        strokeWidth={1}
        className='cursor-pointer'
        onClick={() => {
          setCurrentNote(note)
          goTo(NoteCreateView)
        }}
      />
    </div>
  )
}

export default NoteView
