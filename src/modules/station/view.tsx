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

const side = 'right'

const StationView = () => {
  const { stations, selectedStation, isPlaying, play, pause } =
    useStationsStore()

  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <div className='flex flex-row w-full justify-between items-center cursor-pointer'>
            <h2 className='text-2xl font-bold'>
              {selectedStation?.name || 'N/A'}
            </h2>
            <ArrowRight />
          </div>
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>Stations</SheetTitle>
          </SheetHeader>
          <div className='flex flex-col'>
            {stations.map((station) => (
              <StationItem
                key={station.id}
                station={station}
                isSelected={station.id === selectedStation?.id}
                isPlaying={isPlaying}
                onPlay={() => play(station.id)}
                onPause={() => pause()}
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
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
}

const StationItem = (props: IStationItemProps) => {
  const { station, isSelected, isPlaying, onPlay, onPause } = props
  const PlayIcon = isSelected && isPlaying ? Pause : Play

  return (
    <div
      className={`flex flex-row gap-4 px-4 py-4 container-hover ${isSelected ? 'container-selected' : ''}`}
    >
      <div className='flex flex-col gap-2'>
        <div className='rounded-xl w-[80px] aspect-square'>
          <img className='object-scale-fit' src={station.image} alt='logo' />
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
            fill='hsl(var(--primary))'
            stroke='hsl(var(--primary))'
          />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='text-base font-bold'>{station.name}</div>
        <a href={station.website} target='_blank' className='text-xs mb-1'>
          {station.website}
        </a>
        <small className='text-sm text-muted-foreground line-clamp-3'>
          {station.description}
        </small>
      </div>
    </div>
  )
}

export default StationView
