import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { useState } from 'react'
import useHabitsStore from '@/modules/habit/store.ts'
import { HabitStatus, IHabit } from '@/modules/habit/types.ts'
import { Circle, CircleCheckBig, Edit, Info } from 'lucide-react'
import HabitCreateView from '@/modules/habit/habit-create.tsx'
import { Link } from 'react-chrome-extension-router'
import { Button } from '@/components/ui/button.tsx'

const side = 'bottom'

interface IHabitInfoViewProps {
  habit: IHabit
}

const HabitInfoView = (props: IHabitInfoViewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isBlocking, changeHabitStatus } = useHabitsStore()

  const { habit } = props
  const isActive = habit.status === HabitStatus.active

  return (
    <div className='flex w-full cursor-pointer'>
      <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Info strokeWidth={1} size={16} className='cursor-pointer' />
        </SheetTrigger>
        {isOpen && (
          <SheetContent
            side={side}
            className='w-full min-h-[250px] max-h-[90%] overflow-auto p-0 rounded-tl-xl rounded-tr-xl'
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader className='p-4'>
              <SheetTitle>
                <p className='text-base text-primary font-bold tracking-wide'>
                  {habit.name}
                </p>
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-2 p-4'>
              <div className='flex flex-col gap-2 mb-4'>
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-sm'>Total completions</p>
                  <p className='text-sm font-bold'>
                    {habit.statsTotalCompletions}
                  </p>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-sm'>Current streak</p>
                  <p className='text-sm font-bold'>
                    {habit.statsCurrentStreak}
                  </p>
                </div>
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-sm'>Longest streak</p>
                  <p className='text-sm font-bold'>
                    {habit.statsLongestStreak}
                  </p>
                </div>
              </div>
              {isActive ? (
                <Button
                  disabled={isBlocking}
                  variant='outline'
                  className='mt-4'
                  onClick={async () =>
                    await changeHabitStatus(habit.id, HabitStatus.inactive)
                  }
                >
                  <Circle /> Deactivate
                </Button>
              ) : (
                <Button
                  disabled={isBlocking}
                  className='mt-4'
                  onClick={async () =>
                    await changeHabitStatus(habit.id, HabitStatus.active)
                  }
                >
                  <CircleCheckBig /> Active
                </Button>
              )}
              <Link component={HabitCreateView} props={{ habit }}>
                <Button variant='secondary' className='w-full'>
                  <Edit /> Edit
                </Button>
              </Link>

              {/*<div className='flex mt-8 flex-col'>*/}
              {/*  <h2 className='text-base font-bold tracking-wide'>*/}
              {/*    Last 30 Days Completions*/}
              {/*  </h2>*/}
              {/*  <div className='grid grid-cols-10 gap-2 mt-4'>*/}
              {/*    {Array.from({ length: 30 }, (_, index) => {*/}
              {/*      const isCompleted = Math.random() > 0.5*/}
              {/*      return (*/}
              {/*        <div*/}
              {/*          key={index}*/}
              {/*          className={`w-8 h-8 rounded-xl ${*/}
              {/*            isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'*/}
              {/*          } border border-muted`}*/}
              {/*        ></div>*/}
              {/*      )*/}
              {/*    })}*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}

export default HabitInfoView
