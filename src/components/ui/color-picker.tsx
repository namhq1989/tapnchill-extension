'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'

const ColorPicker = ({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) => {
  const solids = [
    '#000000',
    '#facc15',
    '#f87171',
    '#fb923c',
    '#a3e635',
    '#22d3ee',
    '#c084fc',
    '#f472b6',
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[220px] justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className,
          )}
        >
          <div className='w-full flex items-center gap-2'>
            {background ? (
              <div
                className='h-4 w-4 rounded !bg-center !bg-cover transition-all'
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className='h-4 w-4' />
            )}
            <div className='truncate flex-1'>
              {background ? background : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64'>
        <div className='grid grid-cols-8 gap-2'>
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className='col-span-1 rounded-md h-6 w-6 cursor-pointer'
              onClick={() => setBackground(s)}
            />
          ))}
        </div>
        <Input
          id='custom'
          value={background}
          className='col-span-2 h-8 mt-4'
          onChange={(e) => setBackground(e.currentTarget.value)}
          autoFocus={false}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
