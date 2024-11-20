export interface IStation {
  id: string
  url: string
  format: string
  name: string
  description: string
  website: string
  cover: string
  isFavorite: boolean
  genres: string[]
  type: string
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
  types: IStationFilter[]
  selectedFilterId: string
  selectedTypeId: string
  resetAllFilters: () => void
  selectFilter: (id: string) => void
  selectType: (id: string) => void
}
