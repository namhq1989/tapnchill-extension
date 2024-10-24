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
import { IEffect } from '@/modules/effect/types.ts'
import { ElementType } from 'react'

export const DEFAULT_VOLUME_VALUE = 40

const createItem = (id: string, name: string, icon: ElementType): IEffect => {
  return {
    id: id,
    name: name,
    icon: icon,
    file: `${id}.mp3`,
    volume: DEFAULT_VOLUME_VALUE,
    mutedVolume: 0,
    isAudioLoaded: false,
    loopTimeoutId: null,
  }
}

const listEffects = (): IEffect[] => {
  return [
    createItem('crackling-fire', 'Crackling fire', FlameKindling),
    createItem('rain', 'Rain', CloudRain),
    createItem('wind', 'Wind', Wind),
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
export default listEffects
