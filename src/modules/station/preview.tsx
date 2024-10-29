import { Heart, Pause, Play, VolumeOff } from 'lucide-react'
import StationView from '@/modules/station/view.tsx'
import AmbienceView from '@/modules/ambience/view.tsx'
import useStationsStore from '@/modules/station/store.ts'
import LoadingIndicator from '@/loading-indicator.tsx'

const StationPreview = () => {
  const {
    selectedStation,
    isSwitchingStation,
    isPlaying,
    pause,
    play,
    toggleFavorite,
  } = useStationsStore()
  const PlayIcon = isSwitchingStation
    ? LoadingIndicator
    : isPlaying
      ? Pause
      : Play

  return (
    <div className='flex flex-col w-full min-h-[120px]'>
      <div className='flex flex-grow py-4 px-0'>
        <div className='flex flex-col gap-2'>
          <StationView />
          {selectedStation && (
            <>
              <small className='text-sm text-muted-foreground'>
                {selectedStation.description}
              </small>
              <div className='flex flex-row items-center justify-between my-8 px-4'>
                <PlayIcon
                  strokeWidth={1}
                  size={32}
                  className={`cursor-pointer ${isSwitchingStation ? 'w-8 h-8' : ''}`}
                  onClick={() =>
                    isPlaying ? pause() : play(selectedStation.id)
                  }
                />
                <VolumeOff
                  strokeWidth={1}
                  size={32}
                  className='cursor-pointer'
                />
                <AmbienceView />
                <Heart
                  strokeWidth={1}
                  size={32}
                  className='cursor-pointer'
                  fill={
                    selectedStation.isFavorite ? 'hsl(var(--primary))' : 'none'
                  }
                  stroke={
                    selectedStation.isFavorite
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--foreground))'
                  }
                  onClick={() => toggleFavorite(selectedStation.id)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StationPreview
