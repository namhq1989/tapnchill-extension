import { Heart, Pause, Play, Volume2, VolumeOff } from 'lucide-react'
import StationView from '@/modules/station/view.tsx'
import AmbienceView from '@/modules/ambience/view.tsx'
import useStationsStore from '@/modules/station/store.ts'
import LoadingIndicator from '@/loading-indicator.tsx'
import { Slider } from '@/components/ui/slider.tsx'
import StationInformation from '@/modules/station/information.tsx'

const StationPreview = () => {
  const {
    selectedStation,
    isSwitchingStation,
    isPlaying,
    pause,
    play,
    toggleFavorite,
    volume,
    changeVolumeValue,
    isMuted,
    toggleMute,
  } = useStationsStore()
  const PlayIcon = isSwitchingStation
    ? LoadingIndicator
    : isPlaying
      ? Pause
      : Play

  const VolumeIcon = isMuted ? VolumeOff : Volume2

  return (
    <div className='flex flex-col w-full min-h-[120px] bg-primary rounded-xl p-4'>
      <div className='flex flex-grow py-2 px-0'>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex flex-row w-full justify-between items-center gap-4'>
            <div className='flex flex-row gap-2 items-center'>
              {selectedStation && (
                <StationInformation station={selectedStation} />
              )}
              <p
                className={`${selectedStation ? 'text-2xl' : 'text-xl'} font-bold text-white`}
              >
                {selectedStation?.name || 'Station Unselected'}
              </p>
            </div>
            <StationView />
          </div>
          {!selectedStation ? (
            <small className='text-sm text-gray-300'>
              Pick a station and let the music play!
            </small>
          ) : (
            <div className='flex flex-col'>
              <Slider
                className='w-full mt-8 force-white'
                defaultValue={[volume]}
                max={100}
                step={1}
                onValueChange={(value: number[]) => {
                  changeVolumeValue(value[0])
                }}
                disabled={!isPlaying}
              />
              <div className='flex flex-row items-center justify-between mt-8 px-4'>
                <PlayIcon
                  strokeWidth={1}
                  size={32}
                  className={`text-white dark:text-white cursor-pointer ${isSwitchingStation ? 'w-8 h-8' : ''}`}
                  onClick={() =>
                    isPlaying ? pause() : play(selectedStation.id)
                  }
                  fill={isPlaying ? 'white' : 'none'}
                />
                <VolumeIcon
                  strokeWidth={1}
                  size={32}
                  className='text-white cursor-pointer'
                  onClick={() => toggleMute()}
                  fill={!isMuted ? 'white' : 'none'}
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StationPreview
