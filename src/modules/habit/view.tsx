import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Plus, Settings } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import HabitCreateView from '@/modules/habit/habit-create.tsx'
import useHabitsStore from '@/modules/habit/store.ts'
import { HabitStatus, IHabit, IHabitDailyStats } from '@/modules/habit/types.ts'
import { addDays, format, isBefore, isSameDay, subDays } from 'date-fns'
import HabitInfoView from '@/modules/habit/habit-info.tsx'
import HabitMetricsChart from '@/modules/habit/metrics-chart.tsx'

const HabitView = () => {
  const { habits, stats } = useHabitsStore()

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Daily activities' />
      </div>
      <div className='flex flex-col p-4 gap-8'>
        <HabitMetricsChart stats={stats} />

        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-base font-bold tracking-wide'>Activities</h2>
            <Link component={HabitCreateView} className='cursor-pointer'>
              <Plus />
            </Link>
          </div>
          {habits.map((habit) => (
            <HabitRecordsView key={habit.id} habit={habit} stats={stats} />
          ))}
        </div>
      </div>
    </div>
  )
}
//
// interface IStatsSummaryViewProps {
//   stats: IHabitDailyStats[]
// }
//
// const StatsSummaryView = (props: IStatsSummaryViewProps) => {
//   const { stats } = props
//   const dates = generateDateArray()
//
//   const isAllCompleted = (date: Date): boolean => {
//     const stat = stats.find((stat) => isSameDay(new Date(stat.date), date))
//     return stat ? stat.isCompleted : false
//   }
//
//   return (
//     <div className='flex flex-row gap-2 justify-around'>
//       {dates.map((date, index) => {
//         let styles = ''
//         if (index === dates.length - 1) {
//           styles =
//             'text-muted-foreground ring-1 ring-muted-foreground cursor-not-allowed'
//         } else if (isAllCompleted(date)) {
//           styles = 'bg-primary text-primary-foreground'
//         } else if (index === dates.length - 2) {
//           styles = 'border border-primary'
//         } else {
//           styles = 'border border-dashed border-red-400'
//         }
//
//         return (
//           <DailyActivitiesView
//             key={date.getTime()}
//             date={date}
//             styles={styles}
//           />
//         )
//       })}
//     </div>
//   )
// }

interface IHabitStatsViewProps {
  habit: IHabit
  stats: IHabitDailyStats[]
}

const HabitStatsView = (props: IHabitStatsViewProps) => {
  const { completeHabit } = useHabitsStore()
  const { habit, stats } = props
  const dates = generateDateArray()

  const isCompleted = (date: Date): boolean => {
    const stat = stats.find((stat) => isSameDay(new Date(stat.date), date))
    return stat ? stat.completedIds.includes(habit.id) : false
  }

  return (
    <div className='flex flex-row gap-2 justify-around'>
      {dates.map((date) => {
        const isScheduled = habit.daysOfWeek.includes(date.getDay())
        let canComplete = false

        let styles = ''
        // if (index === dates.length - 1) {
        //   styles =
        //     'text-muted-foreground border border-dashed border-muted-foreground/50 cursor-not-allowed'
        // } else
        if (isCompleted(date)) {
          styles = 'bg-primary text-primary-foreground'
        } else if (!isScheduled || isBefore(date, habit.createdAt)) {
          styles = 'border border-muted-foreground/30 cursor-not-allowed'
        } else {
          styles = 'border border-primary/50 cursor-pointer'
          canComplete = true
        }

        return (
          <div
            key={`habit-stat-${date.getDay()}`}
            className='flex flex-col gap-1 w-full'
            title={canComplete ? 'Check' : ''}
          >
            <p
              className={`self-center ${isScheduled ? '' : 'text-muted-foreground/30'}`}
            >
              {format(date, 'dd')}
            </p>
            <div
              className={`flex h-8 rounded-xl ${styles}`}
              onClick={async () => {
                if (!canComplete) {
                  return
                }
                await completeHabit(habit.id, date)
              }}
            ></div>
          </div>
        )
      })}
    </div>
  )
}

interface IHabitRecordsViewProps {
  habit: IHabit
  stats: IHabitDailyStats[]
}

const HabitRecordsView = (props: IHabitRecordsViewProps) => {
  const { habit, stats } = props
  const isActive = habit.status === HabitStatus.active

  return (
    <div
      className={`flex flex-col gap-4 ${isActive ? 'container-selected' : 'bg-muted/40'} p-4 rounded-xl`}
    >
      <div className='flex flex-row w-full gap-2 items-center'>
        <img
          src={`${import.meta.env.VITE_CDN_ENDPOINT}/${habit.icon}.png`}
          alt={habit.icon}
          width={40}
          height={40}
        />
        <div className='flex flex-col flex-grow'>
          <div className='flex flex-row gap-1'>
            {!isActive && (
              <p className='text-xs font-medium leading-5 text-red-400/30'>
                [Inactive]
              </p>
            )}
            <p
              className={`text-sm font-medium leading-5 ${!isActive ? 'text-muted-foreground/30' : ''}`}
            >
              {habit.name}
            </p>
          </div>
          <p
            className={`text-xs ${!isActive ? 'text-muted-foreground/30' : 'text-muted-foreground'}`}
          >
            {habit.goal}
          </p>
        </div>
        <div className='flex flex-row gap-2'>
          <HabitInfoView habit={habit} />
          <Link component={HabitCreateView} props={{ habit }}>
            <Settings strokeWidth={1} size={16} className='cursor-pointer' />
          </Link>
        </div>
      </div>
      <HabitStatsView habit={habit} stats={stats} />
    </div>
  )
}

const generateDateArray = (): Date[] => {
  const today = new Date()
  const startDate = subDays(today, 6) // Start 5 days before today
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index))
}

export default HabitView
