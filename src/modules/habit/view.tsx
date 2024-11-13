import BackButton from '@/back-button.tsx'
import HeaderTitle from '@/header-title.tsx'
import { PencilRuler, Plus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import HabitCreateView from '@/modules/habit/habit-create.tsx'

const HabitView = () => {
  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Daily activities' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <WeekdaysView />
        <Link
          component={HabitCreateView}
          className='flex flex-row my-4 gap-2 justify-center items-center cursor-pointer'
        >
          <Plus />
          <p className='text-sm font-bold'>New activity</p>
        </Link>
        <div className='flex flex-col gap-2'>
          <HabitRecordsView />
          <HabitRecordsView />
          <HabitRecordsView />
          <HabitRecordsView />
          <HabitRecordsView />
        </div>
      </div>
    </div>
  )
}

const WeekdaysView = () => {
  return (
    <div className='flex flex-row gap-2 justify-around'>
      <div className='flex flex-col gap-1 w-full cursor-pointer'>
        <p className='self-center'>M</p>
        <div className='flex h-8 border border-dashed border-red-600 rounded-sm items-center justify-center'>
          15
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-pointer'>
        <p className='self-center'>T</p>
        <div className='flex h-8 bg-primary text-primary-foreground rounded-sm items-center justify-center'>
          16
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-pointer'>
        <p className='self-center'>W</p>
        <div className='flex h-8 bg-primary text-primary-foreground rounded-sm items-center justify-center'>
          17
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-pointer'>
        <p className='self-center'>T</p>
        <div className='flex h-8 text-primary ring-1 ring-primary rounded-sm items-center justify-center'>
          18
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-not-allowed'>
        <p className='self-center'>F</p>
        <div className='flex h-8 text-muted-foreground ring-1 ring-muted-foreground rounded-sm items-center justify-center'>
          19
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-not-allowed'>
        <p className='self-center'>S</p>
        <div className='flex h-8 text-muted-foreground ring-1 ring-muted-foreground rounded-sm items-center justify-center'>
          20
        </div>
      </div>
      <div className='flex flex-col gap-1 w-full cursor-not-allowed'>
        <p className='self-center'>S</p>
        <div className='flex h-8 text-muted-foreground ring-1 ring-muted-foreground rounded-sm items-center justify-center'>
          21
        </div>
      </div>
    </div>
  )
}

const HabitRecordsView = () => {
  return (
    <div className='flex flex-col gap-4 container-selected p-4 rounded-xl'>
      <div className='flex flex-row w-full gap-2 items-center'>
        <img src='/habit/running.png' alt='running' width={40} height={40} />
        <div className='flex flex-col flex-grow'>
          <p className='text-sm font-medium leading-5'>Running</p>
          <p className='text-xs text-muted-foreground'>In 30 minutes</p>
        </div>
        <PencilRuler strokeWidth={1} size={16} className='w-8 cursor-pointer' />
      </div>
      <WeekdaysView />
    </div>
  )
}

export default HabitView
