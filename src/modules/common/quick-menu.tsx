import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel.tsx'
import TaskView from '@/modules/task/view.tsx'
import { Link } from 'react-chrome-extension-router'
import HabitView from '@/modules/habit/view.tsx'

const QuickMenu = () => {
  return (
    <Carousel
      orientation='horizontal'
      opts={{
        align: 'start',
        dragFree: true,
      }}
      className='w-full'
    >
      <CarouselContent>
        <CarouselItem className='basis-1/5 flex items-center justify-center ml-4'>
          <Link
            component={TaskView}
            className='flex flex-col gap-2 p-4 items-center justify-center'
          >
            <img
              src='https://i.bapbi.app/focus.png?v=2'
              alt='focus'
              className='w-7 h-7 bg-cover'
            />
            <p className='text-xs font-bold'>Focus</p>
          </Link>
        </CarouselItem>
        <CarouselItem className='basis-1/5 flex items-center justify-center'>
          <div
            className='flex flex-col gap-2 p-4 items-center justify-center'
            onClick={() => {
              chrome.windows.getCurrent({ populate: true }, (window) => {
                const windowId = window.id || 0
                chrome.sidePanel.open({ windowId }).then(() => {
                  chrome.extension
                    .getViews({ type: 'popup' })
                    .forEach((v) => v.close())
                })
              })
            }}
          >
            <img
              src='https://i.bapbi.app/notes.png'
              alt='notes'
              className='w-7 h-7 bg-cover'
            />
            <p className='text-xs font-bold'>Note</p>
          </div>
        </CarouselItem>
        <CarouselItem className='basis-1/5 flex items-center justify-center'>
          <Link
            component={TaskView}
            className='flex flex-col gap-2 p-4 items-center justify-center'
          >
            <img
              src='https://i.bapbi.app/task.png?v=2'
              alt='task'
              className='w-7 h-7 bg-cover'
            />
            <p className='text-xs font-bold'>Task</p>
          </Link>
        </CarouselItem>
        <CarouselItem className='basis-1/5 flex items-center justify-center'>
          <Link
            component={HabitView}
            className='flex flex-col gap-2 p-4 items-center justify-center'
          >
            <img
              src='https://i.bapbi.app/habit.png'
              alt='habit'
              className='w-7 h-7 bg-cover'
            />
            <p className='text-xs font-bold'>Habit</p>
          </Link>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}

export default QuickMenu
