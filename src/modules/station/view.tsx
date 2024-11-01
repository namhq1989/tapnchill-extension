import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { ArrowRightLeft, Heart, Pause, Play } from 'lucide-react'
import useStationsStore, {
  FILTER_STATIONS_FAVORITES,
} from '@/modules/station/store.ts'
import { IStation } from '@/modules/station/types.ts'
import LoadingIndicator from '@/loading-indicator.tsx'

const side = 'right'

const StationView = () => {
  const {
    stations,
    selectedStation,
    isSwitchingStation,
    isPlaying,
    play,
    pause,
    toggleFavorite,
    filters,
    selectedFilterId,
    selectFilter,
    genres,
    selectedGenreId,
    selectGenre,
  } = useStationsStore()

  let filteredStations = [...stations]
  if (selectedFilterId === FILTER_STATIONS_FAVORITES) {
    filteredStations = stations.filter((s) => s.isFavorite)
  }

  const PlayIcon = isSwitchingStation
    ? LoadingIndicator
    : isPlaying
      ? Pause
      : Play

  return (
    <div className='flex cursor-pointe'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <ArrowRightLeft className='text-white cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Stations</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-2'>
            {selectedStation && (
              <div className='flex h-[240px] rounded-xl p-4 my-4'>
                <div
                  className={`flex w-full h-full bg-cover rounded-xl`}
                  style={{
                    backgroundImage: `url(${selectedStation.cover})`,
                  }}
                >
                  <div className='flex flex-col self-end items-start justify-center px-4 py-2 w-full bg-black/70 rounded-bl-xl rounded-br-xl gap-1'>
                    <h2 className='text-2xl text-white font-bold tracking-wide'>
                      {selectedStation.name}
                    </h2>
                    <div className='flex flex-row w-full gap-8'>
                      <PlayIcon
                        strokeWidth={1}
                        size={32}
                        className={`text-white dark:text-white cursor-pointer ${isSwitchingStation ? 'w-8 h-8' : ''}`}
                        onClick={() =>
                          isPlaying ? pause() : play(selectedStation.id)
                        }
                        fill={isPlaying ? 'white' : 'none'}
                      />
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
                </div>
              </div>
            )}
            <div className='flex flex-col items-start justify-center p-4 gap-2'>
              <h2 className='font-bold text-base tracking-wide'>
                List stations
              </h2>
              <div className='flex flex-row gap-4'>
                <Select
                  defaultValue={selectedFilterId}
                  onValueChange={(id) => selectFilter(id)}
                >
                  <SelectTrigger className='w-[120px]'>
                    <SelectValue placeholder='All' />
                  </SelectTrigger>
                  <SelectContent>
                    {filters.map((f) => (
                      <SelectItem key={`filter_${f.id}`} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  defaultValue={selectedGenreId}
                  onValueChange={(id) => selectGenre(id)}
                >
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder='All' />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((f) => (
                      <SelectItem key={`genre_${f.id}`} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex w-full p-4'>
              <div className='w-full grid grid-cols-2 gap-4'>
                {filteredStations.map((station) => {
                  if (selectedStation && selectedStation.id === station.id)
                    return null

                  return (
                    <StationItem
                      key={station.id}
                      station={station}
                      onPlay={() => play(station.id)}
                      onToggleFavorite={(id) => toggleFavorite(id)}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface IStationItemProps {
  station: IStation
  onPlay: () => void
  onToggleFavorite: (id: string) => void
}

const StationItem = (props: IStationItemProps) => {
  const { station, onPlay, onToggleFavorite } = props

  return (
    <div className='flex col-span-1 aspect-square items-center justify-center rounded-xl'>
      <div
        className={`flex w-full h-full bg-cover rounded-xl`}
        style={{
          backgroundImage: `url(${station.cover})`,
        }}
      >
        <div className='flex flex-col self-end items-start justify-center p-2 w-full bg-black/70 rounded-bl-xl rounded-br-xl gap-2'>
          <h2 className='text-sm text-white font-bold'>{station.name}</h2>
          <div className='flex flex-row w-full gap-8'>
            <Play
              strokeWidth={2}
              className={`cursor-pointer`}
              onClick={() => onPlay()}
            />
            <Heart
              strokeWidth={1}
              className='text-white cursor-pointer'
              fill={station.isFavorite ? 'white' : 'none'}
              stroke='white'
              onClick={() => onToggleFavorite(station.id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StationView
