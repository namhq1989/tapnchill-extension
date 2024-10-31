import { create } from 'zustand/index'
import { IStationsStore } from '@/modules/station/types.ts'
import listStations from '@/modules/station/list-stations.ts'

export const FILTER_STATIONS_ALL = 'all'
export const FILTER_STATIONS_FAVORITES = 'favorites'

const useStationsStore = create<IStationsStore>((set, get) => ({
  stations: [],
  isPlaying: false,
  isSwitchingStation: false,
  volume: 50,
  startTime: new Date(),
  selectedStation: null,
  initStations: () => {
    chrome.storage.local.get((result) => {
      let stations = listStations()
      const selectedStationId: string = result.selectedStationId || ''
      const favoriteStationIds: string[] = result.favoriteStationIds || []
      const volume: number = result.stationVolume || 50
      const isPlaying: boolean = result.isStationPlaying || false
      const isMuted: boolean = result.isStationMuted || false
      const startTime: Date = result.stationStartTime || new Date()
      const selectedFilterId: string = result.stationSelectedFilterId || 'all'

      let selectedStation = null
      if (selectedStationId) {
        selectedStation = stations.find((s) => s.id === selectedStationId)
      }

      if (favoriteStationIds.length) {
        stations = stations.map((s) => {
          s.isFavorite = favoriteStationIds.includes(s.id)
          return s
        })
      }

      set({
        stations,
        selectedStation,
        volume,
        isPlaying,
        isMuted,
        startTime,
        selectedFilterId,
      })
    })
  },

  play: async (id: string) => {
    const {
      isSwitchingStation,
      selectedStation,
      stations,
      volume,
      isPlaying,
      isMuted,
    } = get()

    if (isSwitchingStation) return

    if (selectedStation && selectedStation.id === id) {
      if (!isPlaying) {
        set({ isSwitchingStation: true })
      }
      chrome.runtime
        .sendMessage({
          type: 'play-station',
          stationUrl: selectedStation.url,
          format: selectedStation.format,
          volume: isMuted ? 0 : volume,
        })
        .then()
      return
    }

    const newStation = stations.find((e) => e.id === id)
    if (!newStation) return

    set({ isSwitchingStation: true })

    chrome.runtime.sendMessage(
      {
        type: 'stop-station',
      },
      () => {
        chrome.runtime.sendMessage(
          {
            type: 'play-station',
            stationUrl: newStation.url,
            format: newStation.format,
            volume,
          },
          () => {
            set({
              selectedStation: newStation,
            })
            chrome.storage.local.set({
              selectedStationId: id,
            })
          },
        )
      },
    )
  },

  pause: () => {
    chrome.runtime
      .sendMessage({
        type: 'pause-station',
      })
      .then()
  },

  changeVolumeValue: (value: number) => {
    const { selectedStation, isPlaying } = get()

    if (!selectedStation || !isPlaying) return

    chrome.runtime.sendMessage(
      {
        type: 'change-station-volume',
        volume: value,
      },
      () => {
        set({ volume: value, isMuted: value === 0 })
        chrome.storage.local
          .set({ stationVolume: value, isStationMuted: value === 0 })
          .then()
      },
    )
  },

  onPlaying: () => {
    set({
      isPlaying: true,
      isSwitchingStation: false,
    })
    chrome.storage.local.set({
      isStationPlaying: true,
    })
  },

  onStopping: () => {
    set({
      isPlaying: false,
      isSwitchingStation: false,
    })
    chrome.storage.local
      .set({
        isStationPlaying: false,
      })
      .then()
  },
  toggleFavorite: (id: string) => {
    chrome.storage.local.get((result) => {
      const favoriteStationIds: string[] = result.favoriteStationIds || []
      let isFavorite = false
      if (favoriteStationIds.includes(id)) {
        favoriteStationIds.splice(favoriteStationIds.indexOf(id), 1)
      } else {
        favoriteStationIds.push(id)
        isFavorite = true
      }

      chrome.storage.local
        .set({
          favoriteStationIds,
        })
        .then()

      const { stations, selectedStation } = get()
      const newStations = stations.map((s) => {
        if (s.id === id) {
          s.isFavorite = isFavorite
        }
        return s
      })
      if (selectedStation && selectedStation.id === id) {
        selectedStation.isFavorite = isFavorite
      }

      set({ stations: newStations, selectedStation })
    })
  },

  isMuted: false,
  toggleMute: () => {
    const { isPlaying, isMuted, volume } = get()
    if (!isPlaying) return

    chrome.runtime.sendMessage(
      {
        type: 'change-station-volume',
        volume: isMuted ? volume : 0,
      },
      () => {
        set({ isMuted: !isMuted })
        chrome.storage.local.set({
          isStationMuted: !isMuted,
        })
      },
    )
  },

  filters: [
    {
      id: FILTER_STATIONS_ALL,
      name: 'All',
    },
    {
      id: FILTER_STATIONS_FAVORITES,
      name: 'Favorites',
    },
  ],
  selectedFilterId: 'all',
  selectFilter: (id: string) => {
    const { selectedFilterId } = get()
    if (selectedFilterId === id) return

    set({ selectedFilterId: id })
    chrome.storage.local.set({
      stationSelectedFilterId: id,
    })
  },
}))

export const { setState } = useStationsStore

export default useStationsStore
