import { ElementType } from 'react'

export interface IAmbience {
  id: string
  name: string
  icon: ElementType
  file: string
  volume: number
  isAdded: boolean
}

export interface IAmbiencesStore {
  ambiences: IAmbience[]
  initAmbiences: () => void
  toggleAmbience: (id: string) => Promise<void>
  changeVolumeValue: (id: string, value: number) => void
}

export interface ISelectedAmbience {
  id: string
  volume: number
}
