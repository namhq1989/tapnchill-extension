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
import useStationsStore from '@/modules/station/store.ts'
import { IStation } from '@/modules/station/types.ts'
import LoadingIndicator from '@/loading-indicator.tsx'
import { Badge } from '@/components/ui/badge.tsx'

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

  // let filteredStations = [...stations]
  // if (selectedFilterId === FILTER_STATIONS_FAVORITES) {
  //   filteredStations = stations.filter((s) => s.isFavorite)
  // }

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
                  className={`flex w-full h-full bg-[url('/covers/acoustic.jpg')] bg-cover rounded-xl`}
                >
                  <div className='flex flex-col self-end items-start justify-center p-4 w-full bg-black/70 rounded-bl-xl rounded-br-xl gap-2'>
                    <h2 className='text-xl text-white font-bold tracking-wide'>
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
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
                <div className='flex col-span-1 aspect-square bg-gray-500 items-center justify-center rounded-xl'>
                  STATION
                </div>
              </div>
            </div>
          </div>
          {/*{selectedStation && (*/}
          {/*  <div className='flex flex-col my-4 gap-2 container-selected'>*/}
          {/*    /!*<div className='text-base ml-4'>Now playing</div>*!/*/}
          {/*    <StationItem*/}
          {/*      key={selectedStation.id}*/}
          {/*      station={selectedStation}*/}
          {/*      isSelected={selectedStation.id === selectedStation?.id}*/}
          {/*      isSwitchingStation={isSwitchingStation}*/}
          {/*      isPlaying={isPlaying}*/}
          {/*      onPlay={() => play(selectedStation.id)}*/}
          {/*      onPause={() => pause()}*/}
          {/*      onToggleFavorite={(id) => toggleFavorite(id)}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
          {/*<div className='p-4'>*/}
          {/*  {filters.map((filter) => (*/}
          {/*    <Badge*/}
          {/*      variant={selectedFilterId === filter.id ? 'default' : 'outline'}*/}
          {/*      key={filter.id}*/}
          {/*      className='cursor-pointer py-2 px-4 mx-1'*/}
          {/*      onClick={() => selectFilter(filter.id)}*/}
          {/*    >*/}
          {/*      {filter.name}*/}
          {/*    </Badge>*/}
          {/*  ))}*/}
          {/*</div>*/}
          {/*<div className='flex flex-col'>*/}
          {/*  {filteredStations.map((station) => {*/}
          {/*    if (selectedStation && selectedStation.id === station.id)*/}
          {/*      return null*/}

          {/*    return (*/}
          {/*      <StationItem*/}
          {/*        key={station.id}*/}
          {/*        station={station}*/}
          {/*        isSelected={station.id === selectedStation?.id}*/}
          {/*        isSwitchingStation={isSwitchingStation}*/}
          {/*        isPlaying={isPlaying}*/}
          {/*        onPlay={() => play(station.id)}*/}
          {/*        onPause={() => pause()}*/}
          {/*        onToggleFavorite={(id) => toggleFavorite(id)}*/}
          {/*      />*/}
          {/*    )*/}
          {/*  })}*/}
          {/*</div>*/}
        </SheetContent>
      </Sheet>
    </div>
  )
}

interface IStationItemProps {
  station: IStation
  isSelected: boolean
  isSwitchingStation: boolean
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onToggleFavorite: (id: string) => void
}

const StationItem = (props: IStationItemProps) => {
  const {
    station,
    isSelected,
    isSwitchingStation,
    isPlaying,
    onPlay,
    onPause,
    onToggleFavorite,
  } = props
  const PlayIcon = !isSelected
    ? Play
    : isSwitchingStation
      ? LoadingIndicator
      : isSelected && isPlaying
        ? Pause
        : Play

  return (
    <div
      className={`group flex flex-row gap-4 px-4 py-4 ${isSelected ? '' : 'container-hover'}`}
    >
      <div className='flex flex-col gap-2'>
        <div className='relative rounded-xl w-[80px] aspect-square'>
          <img
            className='object-cover rounded-xl'
            src={station.image}
            alt='logo'
          />
          {isSelected && (
            <div
              className={`${isSelected ? '' : 'hidden group-hover:block'}`}
            ></div>
          )}

          <div
            className={`absolute inset-0 bg-black/70 rounded-xl items-center justify-center ${
              isSelected ? 'flex' : 'hidden group-hover:flex'
            }`}
          >
            <PlayIcon
              strokeWidth={2}
              size={28}
              className={`cursor-pointer`}
              onClick={() => (isSelected && isPlaying ? onPause() : onPlay())}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-row gap-2 justify-between w-full'>
        <div className='flex flex-col gap-2'>
          <div className='text-base font-bold'>{station.name}</div>
          {station.genres.length > 0 && (
            <div className='flex flex-row flex-wrap gap-2 mb-2'>
              {station.genres.map((genre, index) => (
                <Badge
                  key={index}
                  variant={isSelected ? 'default' : 'secondary'}
                  className='text-xs'
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className='flex mx-2 justify-center items-center'>
          <Heart
            strokeWidth={1}
            size={28}
            className='flex cursor-pointer'
            fill={station.isFavorite ? 'hsl(var(--primary))' : 'none'}
            stroke={
              station.isFavorite
                ? 'hsl(var(--primary))'
                : 'hsl(var(--foreground))'
            }
            onClick={() => onToggleFavorite(station.id)}
          />
        </div>
      </div>
    </div>
  )
}

export default StationView
