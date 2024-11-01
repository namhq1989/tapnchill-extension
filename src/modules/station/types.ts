export interface IStation {
  id: string
  url: string
  format: string
  name: string
  description: string
  website: string
  logo: string
  cover: string
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
  toggleFavorite: (id: string) => void
  isMuted: boolean
  toggleMute: () => void
  filters: IStationFilter[]
  genres: IStationFilter[]
  selectedFilterId: string
  selectedGenreId: string
  resetAllFilters: () => void
  selectFilter: (id: string) => void
  selectGenre: (id: string) => void
}
