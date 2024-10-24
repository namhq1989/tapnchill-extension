import { ElementType } from 'react'
import { Howl } from 'howler'

export interface IEffect {
  id: string
  name: string
  icon: ElementType
  file: string
  volume: number
  mutedVolume: number
  audio?: Howl
  isAudioLoaded: boolean
  loopTimeoutId: number | NodeJS.Timeout | null
}

export interface IEffectStore {
  effects: IEffect[]
  addedEffects: IEffect[]
  initEffects: () => void
  uniqueEffects: (effects: IEffect[]) => IEffect[]
  getEffectById: (id: string) => IEffect | undefined
  addEffectById: (id: string) => Promise<void>
  removeAllAddedEffects: () => void
  toggleEffect: (id: string) => Promise<void>
  changeVolumeValue: (id: string, value: number) => void
  toggleMute: (id: string) => void
  addEffectAudio: (effect: IEffect) => Promise<IEffect>
  deleteEffectAudio: (effect: IEffect) => IEffect
  playLoop: (id: string, ms: number) => void
}
