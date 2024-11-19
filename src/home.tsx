import { useEffect } from 'react'
import useAppStore from '@/store.ts'
import useStationsStore from '@/modules/station/store.ts'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import { ModeToggle } from '@/components/theme/mode-toggle.tsx'
import StationPreview from '@/modules/station/preview.tsx'
import TaskPreview from '@/modules/task/preview.tsx'
import QuotePreview from '@/modules/quote/preview.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'
import StatisticPreview from '@/modules/statistic/preview.tsx'
import { Info } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import InformationView from '@/modules/information/view.tsx'
import HeaderTitle from '@/header-title.tsx'
import useTodoTasksStore from '@/modules/task/todo-tasks-store.ts'
import useGoalsStore from '@/modules/goal/store.ts'
import { Badge } from '@/components/ui/badge.tsx'
import HabitPreview from '@/modules/habit/preview.tsx'
import useQuoteStore from '@/modules/quote/store.ts'
import useWeatherStore from '@/modules/weather/store.ts'
import useHabitsStore from '@/modules/habit/store.ts'
import SubscriptionView from '@/modules/subscription/view.tsx'

const HomeView = () => {
  const { initApp, isInitializing } = useAppStore()
  const { initStations } = useStationsStore()
  const { initAmbiences } = useAmbiencesStore()
  const { fetchQuote } = useQuoteStore()
  const { fetchWeather } = useWeatherStore()
  const { fetchGoals } = useGoalsStore()
  const { fetchTasks } = useTodoTasksStore()
  const { fetchStats, fetchHabits } = useHabitsStore()

  useEffect(() => {
    const init = async () => {
      initStations()
      initAmbiences()

      await Promise.all([
        fetchQuote(),
        fetchWeather(),
        fetchGoals(),
        fetchStats(),
      ])

      await Promise.all([
        fetchTasks(),
        fetchHabits(),
      ])
    }

    const initialize = async () => {
      await initApp() // Wait for initApp to complete
      await init()
    }

    initialize().then()
  }, [
    initApp,
    initStations,
    initAmbiences,
    fetchQuote,
    fetchWeather,
    fetchGoals,
    fetchTasks,
  ])

  if (isInitializing) {
    return (
      <div className='flex flex-col w-full h-full justify-center items-center'>
        <span className='loading loading-spinner text-primary'></span>
      </div>
    )
  }

  return (
    <>
      {/*Hidden class for task statuses color*/}
      <div className='hidden'>
        <span className='text-red-600' />
        <span className='text-orange-600' />
        <span className='text-yellow-600' />
        <span className='text-gray-600' />
      </div>

      <div className='flex flex-col w-[400px] h-[600px] scrollbar-hide'>
        <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
          <div className='flex flex-row gap-4 items-center'>
            <ModeToggle />
            <Link component={InformationView}>
              <Info size={20} className='cursor-pointer' />
            </Link>
            <Link component={SubscriptionView}>
              <Badge variant='default' className='cursor-pointer'>
                Go Pro
              </Badge>
            </Link>
          </div>
          <div className='flex flex-row gap-4 justify-center'>
            <HeaderTitle title='Tap n Chill' />
          </div>
        </div>
        <div className='flex flex-col p-4 gap-x-4 gap-y-8 scrollbar-hide'>
          {/*<NoteCreateView />*/}
          <StationPreview />
          <HabitPreview />
          <TaskPreview />
          <QuotePreview />
          <WeatherPreview />
          <StatisticPreview />
        </div>
      </div>
    </>
  )
}

export default HomeView
