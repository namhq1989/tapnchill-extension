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
      const stations = listStations()
      const selectedStationId: string = result.selectedStationId || ''
      const volume: number = result.stationVolume || 50
      const isPlaying: boolean = result.isStationPlaying || false

      let selectedStation = null
      if (selectedStationId) {
        selectedStation = stations.find((s) => s.id === selectedStationId)
      }

      set({ stations, selectedStation, volume, isPlaying })
    })
  },

  play: async (id: string) => {
    const { isSwitchingStation, selectedStation, stations, volume, isPlaying } =
      get()

    console.log('isSwitchingStation', isSwitchingStation)
    console.log('selectedStation', selectedStation)
    console.log('isPlaying', isPlaying)

    if (isSwitchingStation) return

    if (selectedStation && !isPlaying) {
      console.log('here')
      chrome.runtime.sendMessage(
        {
          type: 'play-station',
          stationUrl: selectedStation.url,
          format: selectedStation.format,
          volume,
        },
        () => {
          set({
            isPlaying: true,
          })
          chrome.storage.session.set({
            isStationPlaying: true,
          })
        },
      )
      return
    }

    if (selectedStation && selectedStation.id === id) return

    set({ isSwitchingStation: true })

    const newStation = stations.find((e) => e.id === id)
    if (!newStation) return

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
              isSwitchingStation: false,
              isPlaying: true,
            })
            chrome.storage.session.set({
              selectedStationId: id,
              isStationPlaying: true,
            })
          },
        )
      },
    )
  },

  pause: () => {
    chrome.runtime.sendMessage(
      {
        type: 'stop-station',
      },
      () => {
        set({ isPlaying: false })
        chrome.storage.session.set({
          isStationPlaying: false,
        })
      },
    )
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
}))

export default useStationsStore
