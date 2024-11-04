import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster.tsx'
import useAmbiencesStore from '@/modules/ambience/store.ts'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import { ModeToggle } from '@/components/theme/mode-toggle.tsx'
import StationPreview from '@/modules/station/preview.tsx'
import useStationsStore, { setState } from '@/modules/station/store.ts'
import WaveForm from '@/wave-form.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'
import TaskPreview from '@/modules/task/preview.tsx'
import StatisticPreview from '@/modules/statistic/preview.tsx'
import QuotePreview from '@/modules/quote/preview.tsx'
import InformationView from '@/modules/information/view.tsx'
import NoteCreateView from '@/modules/note/create.tsx'
import useNoteStore from '@/modules/note/store.ts'

chrome.storage.local.get((result) => {
  if (result.selectedText) {
    useNoteStore
      .getState()
      .openCreateNoteDialog(
        result.selectedText,
        result.pageUrl,
        result.pageTitle,
      )
    chrome.storage.local
      .set({
        selectedText: '',
        pageUrl: '',
        pageTitle: '',
      })
      .then()
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'station-is-playing') {
    setState({
      isPlaying: true,
      isSwitchingStation: false,
      startTime: new Date(),
    })
  } else if (request.type === 'station-is-stopped') {
    setState({
      isPlaying: false,
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
            <InformationView />
            <ModeToggle />
          </div>
        </div>
        <div
          id='content'
          className='flex flex-col p-4 gap-x-4 gap-y-4 scrollbar-hide'
        >
          <NoteCreateView />
          <StationPreview />
          <QuotePreview />
          <TaskPreview />
          <WeatherPreview />
          <StatisticPreview />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
