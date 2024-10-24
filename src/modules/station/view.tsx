import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ArrowRight } from 'lucide-react'

const side = 'right'

const StationView = () => {
  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <div className='flex flex-row w-full justify-between items-center cursor-pointer'>
            <h2 className='text-2xl font-bold'>Station Name</h2>
            <ArrowRight />
          </div>
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Stations</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col'>
            <StationItem />
            <StationItem />
            <StationItem />
            <StationItem />
            <StationItem />
            <StationItem />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

const StationItem = () => {
  return (
    <div className='flex flex-row gap-4 px-4 py-6 hover:bg-muted hover:cursor-pointer'>
      <div className='bg-gray-500 rounded-xl h-[100px] aspect-square'></div>
      <div className='flex flex-col'>
        <div className='text-lg font-bold'>Station Name</div>
        <small className='text-sm text-muted-foreground'>
          Thoughtful, gentle songs, perfect as background music at home or work.
        </small>
      </div>
    </div>
  )
}

export default StationView
