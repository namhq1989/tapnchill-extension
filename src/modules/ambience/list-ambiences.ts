import {
  Bird,
  Bug,
  CloudRain,
  Coffee,
  Droplet,
  FlameKindling,
  Gauge,
  TrainTrack,
  Waves,
  Wind,
  Zap,
} from 'lucide-react'
import { IAmbience } from '@/modules/ambience/types.ts'
import { ElementType } from 'react'

export const DEFAULT_VOLUME_VALUE = 40

const createItem = (id: string, name: string, icon: ElementType): IAmbience => {
  return {
    id: id,
    name: name,
    icon: icon,
    file: `${id}.mp3`,
    volume: DEFAULT_VOLUME_VALUE,
    isAdded: false,
  }
}

const listAmbiences = (): IAmbience[] => {
  return [
    createItem('crackling-fire', 'Crackling fire', FlameKindling),
    createItem('rain', 'Rain', CloudRain),
    createItem('wind-noise', 'Wind', Wind),
    createItem('water', 'Water', Droplet),
    createItem('sea', 'Sea', Waves),
    createItem('bird', 'Bird', Bird),
    createItem('train-track', 'Train track', TrainTrack),
    createItem('coffee-shop', 'Coffee Shop', Coffee),
    createItem('cricket', 'Cricket', Bug),
    createItem('driving', 'Driving', Gauge),
    createItem('thunder', 'Thunder', Zap),
  ]
}
export default listAmbiences
