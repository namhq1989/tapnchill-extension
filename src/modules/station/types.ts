export interface IStation {
  id: string
  url: string
  format: string
  name: string
  description: string
  website: string
  image: string
  isFavorite: boolean
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
  onPlaying: () => void
  onStopping: () => void
  toggleFavorite: (id: string) => void
}
