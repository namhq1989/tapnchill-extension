import { useEffect } from 'react'
import useAppStore from '@/modules/common/store.ts'
import useStationsStore from '@/modules/station/store.ts'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import StationPreview from '@/modules/station/preview.tsx'
import TaskPreview from '@/modules/task/preview.tsx'
import QuotePreview from '@/modules/quote/preview.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'
import StatisticPreview from '@/modules/statistic/preview.tsx'
import { Link } from 'react-chrome-extension-router'
import HeaderTitle from '@/modules/common/header-title.tsx'
import useTodoTasksStore from '@/modules/task/todo-tasks-store.ts'
import useGoalsStore from '@/modules/goal/store.ts'
import { Badge } from '@/components/ui/badge.tsx'
import HabitPreview from '@/modules/habit/preview.tsx'
import useQuoteStore from '@/modules/quote/store.ts'
import useWeatherStore from '@/modules/weather/store.ts'
import useHabitsStore from '@/modules/habit/store.ts'
import SubscriptionView from '@/modules/subscription/view.tsx'
import AppMenu from '@/modules/common/app-menu.tsx'
import LoadingIndicator from '@/modules/common/loading-indicator.tsx'
import QuickMenu from '@/modules/common/quick-menu.tsx'
import Pulse from '@/modules/common/pulse.tsx'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'

const HomeView = () => {
  const {
    initApp,
    isInitializing,
    fetchSubscriptionPlans,
    isSubscriptionEnabled,
    me,
  } = useAppStore()
  const { initStations } = useStationsStore()
  const { initAmbiences } = useAmbiencesStore()
  const { isRunning } = useFocusProgressingStore()
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
        fetchSubscriptionPlans(),
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
      await initApp()
      await init()
    }

    initialize().then()
  }, [
    initApp,
    initStations,
    initAmbiences,
    fetchSubscriptionPlans,
    fetchQuote,
    fetchWeather,
    fetchGoals,
    fetchTasks,
    fetchHabits,
    fetchStats,
  ])

  if (isInitializing) {
    return (
      <div className='flex flex-col gap-8 w-[400px] h-[600px] scrollbar-hide justify-center items-center'>
        <img src='/icons/icon128.png' alt='logo' width={48} height={48} />
        <LoadingIndicator />
      </div>
    )
  }

  if (!me) {
    return (
      <div className='flex flex-col gap-8 w-[400px] h-[600px] scrollbar-hide justify-center items-center p-12'>
        <p className='text-base text-muted-foreground'>
          Something went wrong. Please try again or contact{' '}
          <span className='text-primary underline underline-offset-4'>
            hi@bapbi.app
          </span>{' '}
          for support.
        </p>
      </div>
    )
  }

  return (
    <>
      {/*Hidden classes for task statuses color*/}
      <div className='hidden'>
        <span className='text-red-600' />
        <span className='text-orange-600' />
        <span className='text-yellow-600' />
        <span className='text-gray-600' />
      </div>

      <div className='flex flex-col w-[400px] h-[600px] scrollbar-hide'>
        <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
          <div className='flex flex-row gap-6 items-center'>
            <AppMenu />
            {isRunning && <Pulse />}
            {me.subscription.plan === 'free' ? (
              isSubscriptionEnabled && (
                <Link component={SubscriptionView}>
                  <Badge variant='default' className='cursor-pointer'>
                    Go Pro
                  </Badge>
                </Link>
              )
            ) : (
              <Badge>Pro</Badge>
            )}
          </div>
          <div className='flex flex-row gap-4 justify-center'>
            <HeaderTitle title='BapBi' />
          </div>
        </div>
        <div className='flex flex-col py-4'>
          <QuickMenu />
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
