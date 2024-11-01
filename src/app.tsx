import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster.tsx'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import { ModeToggle } from '@/components/theme/mode-toggle.tsx'
import StationPreview from '@/modules/station/preview.tsx'
import { Info } from 'lucide-react'
import useStationsStore, { setState } from '@/modules/station/store.ts'
import WaveForm from '@/wave-form.tsx'
import TimerPreview from '@/modules/timer/preview.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'
import TaskPreview from '@/modules/task/preview.tsx'

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'offscreen-station-is-playing') {
    setState({
      isPlaying: true,
      isSwitchingStation: false,
      startTime: new Date(),
    })
    chrome.storage.local
      .set({
        isStationPlaying: true,
        stationStartTime: new Date(),
      })
      .then()
  } else if (request.type === 'offscreen-station-is-stopped') {
    setState({
      isPlaying: false,
    })
    chrome.storage.local.set({
      isStationPlaying: false,
    })
  }
})

const App = () => {
  const { initStations, isPlaying } = useStationsStore()
  const { initAmbiences } = useAmbiencesStore()

  useEffect(() => {
    initStations()
    initAmbiences()
  }, [initStations, initAmbiences])

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <div className='flex flex-col w-[400px] h-[600px] scrollbar-hide'>
        <div
          id='header'
          className='flex w-full flex-row justify-between p-4 border-b-[1px]'
        >
          <div className='flex flex-row gap-4 justify-center'>
            <h2 className='text-base text-primary font-bold tracking-wide'>
              Tap & Chill
            </h2>
            {isPlaying && <WaveForm />}
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <Info size={20} className='cursor-pointer' />
            <ModeToggle />
          </div>
        </div>
        <div id='content' className='flex flex-col p-4 gap-4 scrollbar-hide'>
          <StationPreview />
          <div className='grid grid-cols-3 gap-4'>
            <WeatherPreview />
            <TimerPreview />
          </div>
          <TaskPreview />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
