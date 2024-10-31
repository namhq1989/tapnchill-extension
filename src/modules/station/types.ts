export interface IStation {
  id: string
  url: string
  format: string
  name: string
  description: string
  website: string
  image: string
  isFavorite: boolean
  genres: string[]
}

export interface IStationFilter {
  id: string
  name: string
}

export interface IStationsStore {
  stations: IStation[]
  selectedStation: IStation | null
  isPlaying: boolean
  isSwitchingStation: boolean
  volume: number
  startTime: Date
  initStations: () => void
  play: (id: string) => Promise<void>
  pause: () => void
  changeVolumeValue: (value: number) => void
  onPlaying: () => void
  onStopping: () => void
  toggleFavorite: (id: string) => void
  isMuted: boolean
  toggleMute: () => void
  filters: IStationFilter[]
  selectedFilter: string
  selectFilter: (id: string) => void
}
