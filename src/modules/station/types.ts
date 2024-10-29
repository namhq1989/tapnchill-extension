export interface IStation {
  id: string
  url: string
  format: string
  name: string
  description: string
  website: string
  image: string
}

export interface IStationsStore {
  stations: IStation[]
  selectedStation: IStation | null
  isPlaying: boolean
  isSwitchingStation: boolean
  volume: number
  initStations: () => void
  play: (id: string) => Promise<void>
  pause: () => void
  changeVolumeValue: (value: number) => void
}
