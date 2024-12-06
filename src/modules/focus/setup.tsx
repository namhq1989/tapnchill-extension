import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Plus, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import { useState } from 'react'
import useFocusSetupStore, {
  MAX_FOCUS_TIME,
  MIN_FOCUS_TIME,
} from '@/modules/focus/setup-store.ts'

const FocusSetupView = () => {
  const {
    blockedSites,
    maxBlockedSites,
    addBlockedSite,
    removeBlockedSite,
    focusTime,
    setFocusTime,
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
      <div className='flex flex-col p-4 gap-8'>
        <div className='flex flex-col gap-2 mt-2'>
          <div className='flex flex-row items-start justify-between'>
            <div>
              <p className='text-sm font-medium'>Focus time (minutes)</p>
              <p className='text-xs text-muted-foreground'>
                Blocked sites will be inaccessible during Focus time
              </p>
            </div>
            <div className='w-4' />
            <Input
              type='number'
              value={focusTime}
              min={MIN_FOCUS_TIME}
              max={MAX_FOCUS_TIME}
              className='w-[125px]'
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
        </div>
        <Button className='font-bold' onClick={startFocus}>
          Start Session
        </Button>
        <div className='flex flex-col gap-4'>
          <h2 className='text-sm font-bold tracking-wide'>
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
                  className='flex flex-row container-selected rounded-xl p-4 items-center justify-between'
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
      </div>
    </div>
  )
}

export default FocusSetupView
