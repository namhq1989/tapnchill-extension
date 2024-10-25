import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Heart, Pause } from 'lucide-react'

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
    <div className='flex flex-row gap-4 px-4 py-4 badge-hover'>
      <div className='flex flex-col gap-2'>
        <div className='bg-gray-500 rounded-xl h-[80px] aspect-square'></div>
        <div className='flex flex-row items-center justify-evenly gap-4'>
          <Pause strokeWidth={1} className='cursor-pointer' />
          <Heart
            strokeWidth={1}
            className='cursor-pointer'
            fill='hsl(var(--primary))'
            stroke='hsl(var(--primary))'
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='text-base font-bold'>Station Name</div>
        <small className='text-sm text-muted-foreground'>
          Thoughtful, gentle songs, perfect as background music at home or work.
        </small>
        <div className='flex flex-row flex-wrap gap-2 mt-2'>
          <Badge variant='outline'>Instrumental</Badge>
          <Badge variant='outline'>English</Badge>
          <Badge variant='outline'>Radio</Badge>
          <Badge variant='outline'>Gaming</Badge>
        </div>
      </div>
    </div>
  )
}

export default StationView
