import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  console.log('force-white', className?.includes('force-white'))
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={`relative h-1 w-full grow overflow-hidden rounded-full ${className?.includes('force-white') ? 'bg-black' : 'bg-background'}`}
      >
        <SliderPrimitive.Range
          className={`absolute h-full ${className?.includes('force-white') ? 'bg-white' : 'bg-foreground'}`}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={`block h-4 w-4 rounded-full border-2 ${className?.includes('force-white') ? 'border-white bg-white' : 'border-black bg-black'} ${!props.disabled ? 'cursor-pointer' : 'cursor-not-allowed'} dark:border-white dark:bg-white ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-20`}
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
