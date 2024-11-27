import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { goBack } from 'react-chrome-extension-router'
import { ExternalLink, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { INote } from '@/modules/note/types.ts'
import { format } from 'date-fns'
import useNoteStore from '@/modules/note/store.ts'
import { getDomainForDisplaying } from '@/lib/string.ts'

export interface INoteDetailViewProps {
  note: INote
}

const NoteDetailView = (props: INoteDetailViewProps) => {
  const { note } = props
  const { deleteNote } = useNoteStore()

  return (
    <div className='flex flex-col w-[800px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Note information' />
      </div>
      <div className='flex flex-col p-4 gap-2'>
        <p className='text-sm font-bold'>
          {format(note.updatedAt, 'dd/MM/yyyy')}
        </p>
        <p className='text-2xl font-bold'>{note.title}</p>
        {note.data && note.data.pageUrl && (
          <div className='flex flex-col gap-2'>
            <a
              className='flex flex-row gap-2 w-full items-center cursor-pointer'
              href={note.data.pageUrl}
              target='_blank'
            >
              <ExternalLink strokeWidth={1} size={16} />
              <p className='text-sm'>
                {getDomainForDisplaying(note.data.pageUrl)}
              </p>
            </a>
            {note.data.pageText && (
              <div className='text-sm border-l-2 p-4 italic whitespace-pre-line container-selected rounded-xl'>
                {note.data.pageText}
              </div>
            )}
          </div>
        )}
        <p className='text-sm mt-4'>{note.description}</p>
        {/*<Link component={NoteCreateView} props={{ note }}>*/}
        {/*  <Button variant='secondary' className='w-full mt-8'>*/}
        {/*    <Edit /> Edit*/}
        {/*  </Button>*/}
        {/*</Link>*/}

        <DeleteNoteAlert
          onConfirm={async () => {
            await deleteNote(note)
            goBack()
          }}
        />
      </div>
    </div>
  )
}

interface IDeleteNoteAlertProps {
  onConfirm: () => void
}

const DeleteNoteAlert = (props: IDeleteNoteAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='w-full' onClick={() => {}}>
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NoteDetailView
