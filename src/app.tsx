import { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster.tsx'
import useEffectStore from '@/modules/effect/store.ts'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import { ModeToggle } from '@/components/theme/mode-toggle.tsx'
import StationPreview from '@/modules/station/preview.tsx'
import TimerPreview from '@/modules/timer/preview.tsx'
import WeatherPreview from '@/modules/weather/preview.tsx'
import { Info } from 'lucide-react'

const App = () => {
  const initEffects = useEffectStore((state) => state.initEffects)

  useEffect(() => {
    initEffects()
  }, [initEffects])

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <div className='flex flex-col w-[400px] h-[600px] scrollbar-hide'>
        <div
          id='header'
          className='flex w-full flex-row justify-between p-4 border-b-[1px]'
        >
          <h2 className='text-base tracking-wide'>Tap & Chill</h2>
          <div className='flex flex-row gap-4 items-center'>
            <Info size={20} className='cursor-pointer' />
            <ModeToggle />
          </div>
        </div>
        <div id='content' className='flex flex-col p-4 gap-4 scrollbar-hide'>
          <StationPreview />
          <TimerPreview />
          <WeatherPreview />
          {/*<div className='h-0' />*/}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
