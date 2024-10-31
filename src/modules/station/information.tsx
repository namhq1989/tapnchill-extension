import { IStation } from '@/modules/station/types.ts'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card.tsx'
import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge.tsx'

export interface IStationInformationProps {
  station: IStation
}

const StationInformation = (props: IStationInformationProps) => {
  const { station } = props
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info className='text-white cursor-pointer' size={20} />
      </HoverCardTrigger>
      <HoverCardContent className='rounded-xl ml-4 w-[300px]'>
        <div className='flex flex-col p-4 gap-4'>
          <a
            className='text-sm underline underline-offset-2'
            href={station.website}
            target='_blank'
          >
            {station.website}
          </a>
          {station.genres.length > 0 && (
            <div className='flex flex-row flex-wrap gap-2'>
              {station.genres.map((genre, index) => (
                <Badge key={index} className='text-xs'>
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          <p className='text-sm'>{station.description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default StationInformation
