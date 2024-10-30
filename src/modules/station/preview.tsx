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
    <div className='flex flex-col w-full min-h-[120px] bg-primary rounded-xl p-4'>
      <div className='flex flex-grow py-4 px-0'>
        <div className='flex flex-col gap-2 w-full'>
          <StationView />
          {!selectedStation ? (
            <small className='text-sm text-gray-300'>
              Pick a station and let the music play!
            </small>
          ) : (
            <>
              <small className='text-sm text-gray-300'>
                {selectedStation.description}
              </small>
              <div className='flex flex-row items-center justify-between mt-4 px-4'>
                <PlayIcon
                  strokeWidth={1}
                  size={32}
                  className={`text-white dark:text-white cursor-pointer ${isSwitchingStation ? 'w-8 h-8' : ''}`}
                  onClick={() =>
                    isPlaying ? pause() : play(selectedStation.id)
                  }
                  fill={isPlaying ? 'white' : 'none'}
                />
                <VolumeOff
                  strokeWidth={1}
                  size={32}
                  className='text-white cursor-pointer'
                />
                <AmbienceView />
                <Heart
                  strokeWidth={1}
                  size={32}
                  className='text-white cursor-pointer'
                  fill={selectedStation.isFavorite ? 'white' : 'none'}
                  stroke='white'
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
