import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Plus, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { useState } from 'react'
import useFocusSetupStore, {
  MAX_BREAK_TIME,
  MAX_CYCLES,
  MAX_FOCUS_TIME,
  MIN_BREAK_TIME,
  MIN_CYCLES,
  MIN_FOCUS_TIME,
} from '@/modules/focus/setup-store.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import FocusMetricsChart from '@/modules/focus/metrics-chart.tsx'
import FocusMetricsOverall from '@/modules/focus/metrics-overall.tsx'

const FocusSetupView = () => {
  const {
    blockedSites,
    maxBlockedSites,
    addBlockedSite,
    removeBlockedSite,
    focusTime,
    breakTime,
    numOfCycles,
    isPlaySoundOnResting,
    setFocusTime,
    setBreakTime,
    setNumOfCycles,
    setIsPlaySoundOnResting,
    startFocus,
  } = useFocusSetupStore()

  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (key: string) => {
    if (key === 'Enter' && inputValue.trim() !== '') {
      addBlockedSite(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Focus' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <div className='flex flex-col gap-4 mt-2'>
          <div className='flex flex-row items-start justify-between gap-8'>
            <div className='flex-grow'>
              <p className='text-sm font-medium'>Focus time (minutes)</p>
              <p className='text-xs text-muted-foreground'>
                Blocked sites will be inaccessible during Focus time
              </p>
            </div>
            <Input
              type='number'
              value={focusTime}
              min={MIN_FOCUS_TIME}
              max={MAX_FOCUS_TIME}
              className='w-[85px] flex-shrink-0'
              onChange={(e) =>
                setFocusTime(
                  Math.min(
                    Math.max(
                      parseInt(e.target.value || `${MIN_FOCUS_TIME}`, 10),
                      MIN_FOCUS_TIME,
                    ),
                    MAX_FOCUS_TIME,
                  ),
                )
              }
            />
          </div>
          <div className='flex flex-row items-start justify-between gap-8'>
            <div className='flex-grow'>
              <p className='text-sm font-medium'>Break time (minutes)</p>
              <p className='text-xs text-muted-foreground'>
                Take a moment to relax, stretch, or do something enjoyable
              </p>
            </div>
            <Input
              type='number'
              value={breakTime}
              min={MIN_BREAK_TIME}
              max={MAX_BREAK_TIME}
              className='w-[85px] flex-shrink-0'
              onChange={(e) =>
                setBreakTime(
                  Math.min(
                    Math.max(
                      parseInt(e.target.value || `${MIN_BREAK_TIME}`, 10),
                      MIN_BREAK_TIME,
                    ),
                    MAX_BREAK_TIME,
                  ),
                )
              }
            />
          </div>
          <div className='flex flex-row items-start justify-between gap-8'>
            <div className='flex-grow'>
              <p className='text-sm font-medium'>Number of cycles</p>
              <p className='text-xs text-muted-foreground'>
                Each cycle includes one Focus time and one Break time
              </p>
            </div>
            <Input
              type='number'
              value={numOfCycles}
              min={MIN_CYCLES}
              max={MAX_CYCLES}
              className='w-[85px] flex-shrink-0'
              onChange={(e) =>
                setNumOfCycles(
                  Math.min(
                    Math.max(
                      parseInt(e.target.value || `${MIN_CYCLES}`, 10),
                      MIN_CYCLES,
                    ),
                    MAX_CYCLES,
                  ),
                )
              }
            />
          </div>
          <div className='flex items-center justify-between my-4'>
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Notify me with sound for breaks
            </label>
            <div className='w-[40px] flex items-center justify-center'>
              <Checkbox
                id='enable-resting-sound'
                checked={isPlaySoundOnResting}
                onCheckedChange={(value) => {
                  setIsPlaySoundOnResting(value as boolean)
                }}
              />
            </div>
          </div>
        </div>
        <Button className='font-bold' onClick={startFocus}>
          Start Session
        </Button>
        <div className='flex flex-col gap-4 mt-8'>
          <h2 className='text-base font-bold tracking-wide'>
            Blocked sites ({blockedSites.length}/{maxBlockedSites})
          </h2>
          <div className='flex w-full max-w-sm items-center space-x-2'>
            <Input
              placeholder='Enter website address'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e.key)}
            />
            <Button
              variant='secondary'
              type='button'
              onClick={() => {
                addBlockedSite(inputValue.trim())
                setInputValue('')
              }}
            >
              <Plus /> Add
            </Button>
          </div>
          <ScrollArea className='w-full h-[250px] rounded-xl border p-4'>
            <div className='flex flex-col gap-2'>
              {blockedSites.map((site, index) => (
                <div
                  key={index}
                  className='flex flex-row container-selected rounded-xl px-4 py-2 items-center justify-between'
                >
                  <div className='flex flex-row gap-2 items-center justify-center'>
                    <img
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${site.hostname}`}
                      alt={`${site} logo`}
                      className='w-4 h-4'
                    />
                    <p
                      className='text-xs font-bold truncate max-w-[220px]'
                      title={site.hostname}
                    >
                      {site.hostname}
                    </p>
                  </div>
                  <Trash2
                    size={16}
                    strokeWidth={1}
                    className='cursor-pointer'
                    onClick={() => removeBlockedSite(site.hostname)}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <FocusMetricsChart />
        <FocusMetricsOverall />
      </div>
    </div>
  )
}

export default FocusSetupView
