import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { ArrowRight, Heart, Pause, Play } from 'lucide-react'
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
    selectedFilter,
    selectFilter,
  } = useStationsStore()

  return (
    <div className='flex cursor-pointe'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <ArrowRight className='text-white w-8 h-8 cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Stations</SheetTitle>
          </SheetHeader>
          <div className='p-4'>
            {filters.map((filter) => (
              <Badge
                variant={selectedFilter === filter.id ? 'secondary' : 'outline'}
                key={filter.id}
                className='cursor-pointer py-2 px-4 mx-1'
                onClick={() => selectFilter(filter.id)}
              >
                {filter.name}
              </Badge>
            ))}
          </div>
          <div className='flex flex-col mt-4'>
            {stations.map((station) => (
              <StationItem
                key={station.id}
                station={station}
                isSelected={station.id === selectedStation?.id}
                isSwitchingStation={isSwitchingStation}
                isPlaying={isPlaying}
                onPlay={() => play(station.id)}
                onPause={() => pause()}
                onToggleFavorite={(id) => toggleFavorite(id)}
              />
            ))}
          </div>
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
      className={`flex flex-row gap-4 px-4 py-4 container-hover ${isSelected ? 'container-selected' : ''}`}
    >
      <div className='flex flex-col gap-2'>
        <div className='rounded-xl w-[80px] aspect-square'>
          <img
            className='object-scale-fit rounded-xl'
            src={station.image}
            alt='logo'
          />
        </div>
        <div className='flex flex-row items-center justify-evenly gap-4'>
          <PlayIcon
            strokeWidth={1}
            className='cursor-pointer'
            onClick={() => (isSelected && isPlaying ? onPause() : onPlay())}
          />
          <Heart
            strokeWidth={1}
            className='cursor-pointer'
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
      <div className='flex flex-col'>
        <div className='text-base font-bold'>{station.name}</div>
        <a
          href={station.website}
          target='_blank'
          className='text-xs mb-2 underline underline-offset-2'
        >
          {station.website}
        </a>
        {station.genres.length > 0 && (
          <div className='flex flex-row flex-wrap gap-2 mb-2'>
            {station.genres.map((genre, index) => (
              <Badge key={index} className='text-xs'>
                {genre}
              </Badge>
            ))}
          </div>
        )}
        <small
          className='text-xs text-muted-foreground line-clamp-3'
          title={station.description}
        >
          {station.description}
        </small>
      </div>
    </div>
  )
}

export default StationView
