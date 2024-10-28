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
  addedAmbiences: IAmbience[]
  initAmbiences: () => void
  uniqueAmbiences: (ambiences: IAmbience[]) => IAmbience[]
  getAmbienceById: (id: string) => IAmbience | undefined
  addAmbienceById: (id: string) => Promise<void>
  toggleAmbience: (id: string) => Promise<void>
  changeVolumeValue: (id: string, value: number) => void
}
