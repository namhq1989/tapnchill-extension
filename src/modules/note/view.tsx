import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { ChevronRight, ExternalLink, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Link } from 'react-chrome-extension-router'
import NoteDetailView from '@/modules/note/note-detail.tsx'
import NoteCreateView from '@/modules/note/note-create.tsx'

const NoteView = () => {
  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Notes' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row gap-2 items-center'>
            <Input className='w-[150px] h-[32px]' />
            <Button variant='secondary' className='h-[32px]'>
              Search
            </Button>
          </div>
          <Link component={NoteCreateView}>
            <Plus className='cursor-pointer' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
          <NoteItem />
          <NoteItem />
          <NoteItem />
          <NoteItem />
          <NoteItem />
          <NoteItem />
        </div>
      </div>
    </div>
  )
}

const NoteItem = () => {
  return (
    <div className='flex flex-col container-selected p-4 rounded-xl gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-sm'>12/05/2024</p>
        <Link component={NoteDetailView}>
          <ChevronRight strokeWidth={1} className='cursor-pointer' />
        </Link>
      </div>
      <div className='flex flex-col gap-2'>
        <p className='text-xl font-bold'>Note title</p>
        <p className='text-sm text-muted-foreground'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id tempor
          vitae eros vel inceptos tortor facilisi arcu cum venenatis nisl ...
        </p>
      </div>
      <div className='flex flex-row gap-2 w-full px-4 py-2 bg-background rounded-xl items-center cursor-pointer'>
        <ExternalLink strokeWidth={1} size={16} />
        <p className='text-sm'>github.com</p>
      </div>
    </div>
  )
}

export default NoteView
