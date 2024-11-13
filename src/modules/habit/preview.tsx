import { ListPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'
import { Link } from 'react-chrome-extension-router'
import HabitView from '@/modules/habit/view.tsx'

const HabitPreview = () => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>
          MONDAY Activities (2/4)
        </h2>
        <div className='flex flex-row gap-4'>
          <Link component={HabitView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2 items-start'>
        <div className='flex flex-row w-full gap-4 rounded-xl container-selected p-4 items-center'>
          <img src='/habit/running.png' alt='running' width={40} height={40} />
          <div className='flex flex-col flex-grow gap-2'>
            <p className='text-sm font-medium leading-tight'>Running</p>
            <p className='text-xs text-muted-foreground'>In 30 minutes</p>
          </div>
          <Badge
            variant='outline'
            className='cursor-pointer ring-1 text-muted-foreground ring-muted-foreground'
          >
            Complete
          </Badge>
        </div>
        <div className='flex flex-row w-full gap-4 rounded-xl container-selected p-4 items-center'>
          <img
            src='/habit/drink-water.png'
            alt='drink-water'
            width={40}
            height={40}
          />
          <div className='flex flex-col flex-grow gap-2'>
            <p className='text-sm font-medium leading-tight'>Drink water</p>
            <p className='text-xs text-muted-foreground'>2,000ml</p>
          </div>
          <Badge variant='default'>Good job</Badge>
        </div>
        <div className='flex flex-row w-full gap-4 rounded-xl container-selected p-4 items-center'>
          <img src='/habit/yoga.png' alt='yoga' width={40} height={40} />
          <div className='flex flex-col flex-grow gap-2'>
            <p className='text-sm font-medium leading-tight'>Yoga</p>
            <p className='text-xs text-muted-foreground'>In 1 hour</p>
          </div>
          <Badge variant='default'>Good job</Badge>
        </div>
        <div className='flex flex-row w-full gap-4 rounded-xl container-selected p-4 items-center'>
          <img
            src='/habit/learning.png'
            alt='learning'
            width={40}
            height={40}
          />
          <div className='flex flex-col flex-grow gap-2'>
            <p className='text-sm font-medium leading-tight'>Learning</p>
            <p className='text-xs text-muted-foreground'>In 30 minutes</p>
          </div>
          <Badge
            variant='outline'
            className='cursor-pointer ring-1 text-muted-foreground ring-muted-foreground'
          >
            Complete
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default HabitPreview
