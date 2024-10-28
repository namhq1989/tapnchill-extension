import { create } from 'zustand'
import { IAmbience, IAmbiencesStore } from '@/modules/ambience/types.ts'
import listAmbiences, {
  DEFAULT_VOLUME_VALUE,
} from '@/modules/ambience/list-ambiences.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const MAX_ADDED_AMBIENCES = 3
const { showErrorNotification } = useNotificationStore.getState()

const useAmbiencesStore = create<IAmbiencesStore>((set, get) => ({
  ambiences: [],
  addedAmbiences: [],
  initAmbiences: () => {
    const ambiences = listAmbiences()
    set({ ambiences })
  },

  uniqueAmbiences: (ambiences: IAmbience[]) => {
    const ambienceMap = new Map<string, IAmbience>()

    ambiences.forEach((ambience) => {
      ambienceMap.set(ambience.id, ambience)
    })

    return Array.from(ambienceMap.values())
  },

  getAmbienceById: (id: string) => {
    return get().ambiences.find((e) => e.id === id)
  },

  addAmbienceById: async (id: string) => {
    const { ambiences, addedAmbiences } = get()

    const ambience = ambiences.find((e) => e.id === id)
    if (!ambience) return

    const isAdded = addedAmbiences.findIndex((e) => e.id === id) > -1
    if (isAdded) return

    const modificationAmbience = { ...ambience }
    modificationAmbience.volume = DEFAULT_VOLUME_VALUE
    addedAmbiences.push(modificationAmbience)

    set({
      addedAmbiences,
    })
  },

  toggleAmbience: async (id: string) => {
    const { ambiences } = get()

    const ambience = ambiences.find((e) => e.id === id)
    if (!ambience) return

    const totalAdded = ambiences.filter((e) => e.isAdded).length
    if (!ambience.isAdded && totalAdded >= MAX_ADDED_AMBIENCES) {
      showErrorNotification({
        description: `You can only add up to ${MAX_ADDED_AMBIENCES} ambiences at a time`,
      })

      return
    }

    if (!ambience.isAdded) {
      chrome.runtime.sendMessage(
        {
          type: 'play-ambience',
          id: ambience.id,
          audioUrl: `${import.meta.env.VITE_BASE_URL}/ambiences/${ambience.file}`,
          volume: ambience.volume,
        },
        () => {
          ambience.isAdded = true
          set({
            ambiences: ambiences.map((e) => (e.id === id ? ambience : e)),
          })
        },
      )
    } else {
      chrome.runtime.sendMessage(
        {
          type: 'pause-ambience',
          id: ambience.id,
        },
        () => {
          ambience.isAdded = false
          set({
            ambiences: ambiences.map((e) => (e.id === id ? ambience : e)),
          })
        },
      )
    }
  },

  changeVolumeValue: (id: string, value: number) => {
    const { ambiences } = get()
    const ambience = ambiences.find((e) => e.id === id)
    if (!ambience) return

    chrome.runtime.sendMessage(
      {
        type: 'change-ambience-volume',
        id: ambience.id,
        volume: value,
      },
      () => {
        ambience.volume = value
        set({
          ambiences: ambiences.map((e) => (e.id === id ? ambience : e)),
        })
      },
    )
  },
}))

export default useAmbiencesStore
