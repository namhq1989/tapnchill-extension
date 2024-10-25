import { ElementType } from 'react'
import { Howl } from 'howler'

export interface IAmbience {
  id: string
  name: string
  icon: ElementType
  file: string
  volume: number
  audio?: Howl
  isAdded: boolean
  isAudioLoaded: boolean
  loopTimeoutId: number | NodeJS.Timeout | null
}

export interface IAmbiencesStore {
  ambiences: IAmbience[]
  addedAmbiences: IAmbience[]
  initAmbiences: () => void
  uniqueAmbiences: (ambiences: IAmbience[]) => IAmbience[]
  getAmbienceById: (id: string) => IAmbience | undefined
  addAmbienceById: (id: string) => Promise<void>
  removeAllAddedAmbiences: () => void
  toggleAmbience: (id: string) => Promise<void>
  changeVolumeValue: (id: string, value: number) => void
  addAmbienceAudio: (ambience: IAmbience) => Promise<IAmbience>
  deleteAmbienceAudio: (ambience: IAmbience) => IAmbience
  playLoop: (ambience: IAmbience, ms: number) => void
}
