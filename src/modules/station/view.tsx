import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
    <div className='flex flex-row gap-4 px-4 py-4 container-hover'>
      <div className='flex flex-col gap-2'>
        <div className='rounded-xl w-[80px] aspect-square'>
          <img
            className='object-scale-fit'
            src='https://cdn-profiles.tunein.com/s190122/images/logod.jpg?t=636656470344730000'
            alt='logo'
          />
        </div>
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
        <a
          href='https://somafm.com/folkfwd/'
          target='_blank'
          className='text-xs mb-1'
        >
          somafm.com
        </a>
        <small className='text-sm text-muted-foreground'>
          Thoughtful, gentle songs, perfect as background music at home or work.
        </small>
      </div>
    </div>
  )
}

export default StationView
