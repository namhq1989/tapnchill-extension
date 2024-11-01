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

import { ArrowRightLeft, Heart, Pause, Play, RefreshCw } from 'lucide-react'
import useStationsStore, {
  FILTER_STATIONS_ALL,
  FILTER_STATIONS_FAVORITES,
} from '@/modules/station/store.ts'
import { IStation } from '@/modules/station/types.ts'
import LoadingIndicator from '@/loading-indicator.tsx'
import StationInformation from '@/modules/station/information.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import WaveForm from '@/wave-form.tsx'

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
    resetAllFilters,
  } = useStationsStore()

  let filteredStations = [...stations]
  if (selectedFilterId === FILTER_STATIONS_FAVORITES) {
    filteredStations = stations.filter((s) => s.isFavorite)
  }
  if (selectedGenreId !== FILTER_STATIONS_ALL) {
    filteredStations = filteredStations.filter((s) =>
      s.genres.includes(selectedGenreId),
    )
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
        <SheetContent
          id='list-stations'
          side={side}
          className='w-full overflow-auto p-0'
        >
          <SheetHeader className='p-4'>
            <SheetTitle>
              <div className='flex flex-row gap-4 justify-center'>
                <h2 className='text-base text-primary font-bold tracking-wide'>
                  Stations
                </h2>
                {isPlaying && <WaveForm />}
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-8'>
            {selectedStation && (
              <div className='flex flex-col gap-2  my-4'>
                <div className='flex h-[240px] rounded-xl'>
                  <div
                    className={`flex w-full h-full bg-cover`}
                    style={{
                      backgroundImage: `url(${selectedStation.cover})`,
                    }}
                  >
                    <div className='flex flex-col self-end items-start justify-center p-4 w-full bg-black/70 rounded-bl-xl rounded-br-xl'>
                      <div className='flex flex-row w-full justify-between'>
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
                        <StationInformation
                          station={selectedStation}
                          strokeWidth={1}
                          size={32}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <h2 className='text-xl font-bold tracking-wide px-4'>
                  {selectedStation.name}
                </h2>
              </div>
            )}
            {selectedStation && <Separator className='w-[60%] self-center' />}
            <div className='flex flex-col p-4 gap-4'>
              <div className='flex flex-row gap-4 items-center justify-start'>
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
                <RefreshCw
                  className='cursor-pointer'
                  size={20}
                  onClick={() => resetAllFilters()}
                />
              </div>
              <div className='flex w-full'>
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
          </div>
          <div className='h-2' />
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
    <div className='flex flex-col gap-2'>
      <div className='flex col-span-1 h-[120px] items-center justify-center rounded-xl'>
        <div
          className={`flex w-full h-full bg-cover rounded-xl`}
          style={{
            backgroundImage: `url(${station.cover})`,
          }}
        >
          <div className='flex flex-col self-end items-start justify-center p-4 w-full bg-black/70 rounded-bl-xl rounded-br-xl justify-between'>
            <div className='flex flex-row w-full gap-8'>
              <Play
                strokeWidth={1}
                className={`text-white cursor-pointer`}
                onClick={() => {
                  onPlay()
                  setTimeout(() => {
                    const d = document.querySelector('#list-stations')
                    if (d) {
                      d.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }, 0)
                }}
              />
              <Heart
                strokeWidth={1}
                className='text-white cursor-pointer'
                fill={station.isFavorite ? 'white' : 'none'}
                stroke='white'
                onClick={() => onToggleFavorite(station.id)}
              />
              <StationInformation station={station} strokeWidth={1} size={24} />
            </div>
          </div>
        </div>
      </div>
      <h2 className='text-sm font-bold'>{station.name}</h2>
    </div>
  )
}

export default StationView
