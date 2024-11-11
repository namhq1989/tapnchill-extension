import { useEffect } from 'react'
import useAppStore from '@/store.ts'
import useStationsStore from '@/modules/station/store.ts'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import useTaskStore from '@/modules/task/store.ts'
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

const HomeView = () => {
  const { initApp } = useAppStore()
  const { initStations } = useStationsStore()
  const { initAmbiences } = useAmbiencesStore()
  const { initTasks } = useTaskStore()

  useEffect(() => {
    const init = async () => {
      await initApp()
      initStations()
      initAmbiences()
      await initTasks()
    }

    init().then()
  }, [initApp, initStations, initAmbiences, initTasks])

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
          </div>
          <div className='flex flex-row gap-4 justify-center'>
            <HeaderTitle title='Tap n Chill' />
          </div>
        </div>
        <div className='flex flex-col p-4 gap-x-4 gap-y-8 scrollbar-hide'>
          {/*<NoteCreateView />*/}
          <StationPreview />
          <TaskPreview />
          {/*<NotePreview />*/}
          <QuotePreview />
          <WeatherPreview />
          <StatisticPreview />
        </div>
      </div>
    </>
  )
}

export default HomeView
