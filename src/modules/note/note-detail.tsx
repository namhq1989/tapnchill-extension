import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Link } from 'react-chrome-extension-router'
import { Edit, Trash2 } from 'lucide-react'
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
import NoteCreateView from '@/modules/note/note-create.tsx'

const NoteDetailView = () => {
  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Note information' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <p className='text-sm'>12/05/2024</p>
        <p className='text-3xl font-bold'>Note title</p>
        <div className='flex flex-col gap-2 pl-4 border-l-4'>
          <h4
            className='scroll-m-20 text-base tracking-tight truncate max-w-xs'
            title='page title'
          >
            Page title
          </h4>
          <div className='text-sm border-l-2 p-4 italic whitespace-pre-line container-selected rounded-xl'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id tempor
            vitae eros vel inceptos tortor facilisi arcu cum venenatis nisl ...
          </div>
        </div>
        <p className='text-sm'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Faucibus
          parturient platea ridiculus velit ac magna habitasse in diam
          porttitor. Suspendisse litora convallis elementum fringilla a turpis
          netus lobortis suspendisse odio. Placerat lacus ridiculus gravida
          nulla blandit magnis egestas congue orci nulla. Metus cubilia non
          dolor dui interdum eu natoque pharetra id platea. Metus nostra
          inceptos taciti mollis vivamus consequat proin malesuada pellentesque
          senectus. Aenean nulla integer bibendum ligula erat posuere accumsan
          adipiscing neque volutpat. Taciti aptent eu habitant feugiat consequat
          tincidunt curabitur ad fringilla magnis. Per eros sed auctor morbi eu
          cras mauris ligula fusce facilisi. Ac eget lectus odio urna sem dui
          eleifend mus urna eleifend. Suscipit lorem interdum at nam feugiat
          condimentum magnis blandit molestie odio. Rhoncus ligula tempus
          dignissim laoreet pulvinar elementum leo cras adipiscing himenaeos.
          Aenean magnis cras mus hendrerit elementum penatibus viverra nisl nam
          platea. Mi congue porttitor torquent cubilia suscipit per donec
          interdum cubilia maecenas.
        </p>
        <Link component={NoteCreateView}>
          <Button variant='secondary' className='w-full mt-4'>
            <Edit /> Edit
          </Button>
        </Link>

        <DeleteNoteAlert onConfirm={async () => {}} />
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
