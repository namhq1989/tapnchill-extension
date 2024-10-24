import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster.tsx'
import useEffectStore from '@/modules/effect/store.ts'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import { ModeToggle } from '@/components/theme/mode-toggle.tsx'
import StationPreview from '@/modules/station/preview.tsx'
import EffectPreview from '@/modules/effect/preview.tsx'
import TimerPreview from '@/modules/timer/preview.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'

const App = () => {
  const initEffects = useEffectStore((state) => state.initEffects)

  useEffect(() => {
    initEffects()
  }, [initEffects])

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <div className='flex flex-col w-[400px] h-[600px]'>
        <div
          id='header'
          className='flex w-full flex-row justify-between p-4 border-b-[1px]'
        >
          <h2 className='text-xl font-bold tracking-wide'>Tap & Chill</h2>
          <ModeToggle />
        </div>
        <div
          id='content'
          className='flex flex-col p-4 mt-4 gap-4 scrollbar-hide'
        >
          <StationPreview />
          <EffectPreview />
          <TimerPreview />
          <WeatherPreview />
          <div className='h-0' />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
