import { create } from 'zustand/index'
import { IStationsStore } from '@/modules/station/types.ts'
import listStations from '@/modules/station/list-stations.ts'

const useStationsStore = create<IStationsStore>((set, get) => ({
  stations: [],
  isPlaying: false,
  isSwitchingStation: false,
  volume: 50,
  selectedStation: null,
  initStations: () => {
    chrome.storage.session.get((result) => {
      let stations = listStations()
      const selectedStationId: string = result.selectedStationId || ''
      const favoriteStationIds: string[] = result.favoriteStationIds || []
      const volume: number = result.stationVolume || 50
      const isPlaying: boolean = result.isStationPlaying || false

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

      set({ stations, selectedStation, volume, isPlaying })
    })
  },

  play: async (id: string) => {
    const { isSwitchingStation, selectedStation, stations, volume, isPlaying } =
      get()

    if (isSwitchingStation) return

    if (selectedStation && selectedStation.id === id) {
      if (!isPlaying) {
        set({ isSwitchingStation: true })
      }
      chrome.runtime.sendMessage({
        type: isPlaying ? 'pause-station' : 'resume-station',
      })
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
            chrome.storage.session.set({
              selectedStationId: id,
            })
          },
        )
      },
    )
  },

  pause: () => {
    chrome.runtime.sendMessage({
      type: 'pause-station',
    })
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
        set({ volume: value })
        chrome.storage.session.set({ stationVolume: value })
      },
    )
  },

  onPlaying: () => {
    set({
      isPlaying: true,
      isSwitchingStation: false,
    })
    chrome.storage.session.set({
      isStationPlaying: true,
    })
  },

  onStopping: () => {
    set({
      isPlaying: false,
      isSwitchingStation: false,
    })
    chrome.storage.session.set({
      isStationPlaying: false,
    })
  },
  toggleFavorite: (id: string) => {
    chrome.storage.session.get((result) => {
      const favoriteStationIds: string[] = result.favoriteStationIds || []
      let isFavorite = false
      if (favoriteStationIds.includes(id)) {
        favoriteStationIds.splice(favoriteStationIds.indexOf(id), 1)
      } else {
        favoriteStationIds.push(id)
        isFavorite = true
      }

      chrome.storage.session.set({
        favoriteStationIds,
      })

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
}))

export const { setState } = useStationsStore

export default useStationsStore
