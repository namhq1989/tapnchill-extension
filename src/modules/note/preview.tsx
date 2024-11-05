import { ChevronRight } from 'lucide-react'

const NotePreview = () => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between'>
        <h2 className='text-base font-bold tracking-wide'>Recent Notes</h2>
        <ChevronRight className='cursor-pointer' />
      </div>
      <div className='flex flex-col'>
        <NotePreviewItem />
        <NotePreviewItem />
        <NotePreviewItem />
      </div>
    </div>
  )
}

const NotePreviewItem = () => {
  return (
    <div className='flex flex-col gap-1 hover:cursor-pointer rounded-xl hover:rounded-xl container-hover p-4'>
      <p className='text-xs text-muted-foreground'>04/11/2024, 15:50</p>
      <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col space-y-1 text-muted-foreground'>
        Translation - Translation bot
      </p>
      <p className='text-sm font-normal leading-snug'>
        It was developed by Joseph Pilates in the early 20th century ...
      </p>
    </div>
  )
}

export default NotePreview
