import { Heart, Pause, VolumeOff } from 'lucide-react'
import StationView from '@/modules/station/view.tsx'
import EffectPreview from '@/modules/effect/preview.tsx'

const StationPreview = () => {
  return (
    <div className='flex flex-col w-full min-h-[120px]'>
      <div className='flex flex-grow py-4 px-0'>
        <div className='flex flex-col gap-2'>
          <StationView />
          <small className='text-sm text-muted-foreground'>
            Thoughtful, gentle songs, perfect as background music at home or
            work.
          </small>
          <div className='flex flex-row items-center justify-between my-6 px-8'>
            <VolumeOff strokeWidth={1} size={32} className='cursor-pointer' />
            <Pause strokeWidth={1} size={32} className='cursor-pointer' />
            <Heart
              strokeWidth={1}
              size={32}
              className='cursor-pointer'
              fill='hsl(var(--primary))'
              stroke='hsl(var(--primary))'
            />
          </div>
          <EffectPreview />
        </div>
      </div>
    </div>
  )
}

export default StationPreview
