import { create } from 'zustand'
import { IAmbience, IAmbiencesStore } from '@/modules/ambience/types.ts'
import listAmbiences, {
  DEFAULT_VOLUME_VALUE,
} from '@/modules/ambience/list-ambiences.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { Howl } from 'howler'

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

  removeAllAddedAmbiences: () => {
    const { addedAmbiences, deleteAmbienceAudio } = get()

    for (const ambience of addedAmbiences) {
      deleteAmbienceAudio(ambience)
    }

    set({
      addedAmbiences: [],
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
        (response) => {
          if (!response?.success) {
            showErrorNotification({
              description: response?.message || 'Cannot play ambience',
            })
            return
          }

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
        (response) => {
          if (!response?.success) {
            showErrorNotification({
              description: response?.message || 'Cannot pause ambience',
            })
            return
          }

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
    if (!ambience || !ambience.audio) return

    ambience.audio!.volume(value / 100)
    ambience.volume = value

    set({
      ambiences: ambiences.map((e) => (e.id === id ? ambience : e)),
    })
  },

  addAmbienceAudio: async (ambience: IAmbience): Promise<IAmbience> => {
    if (ambience.audio) {
      ambience.audio.play()
      return ambience
    }

    const soundSrc = `${import.meta.env.VITE_BASE_URL}/ambiences/${ambience.file}`
    ambience.audio = new Howl({
      src: [soundSrc],
      loop: false,
      html5: true,
      preload: true,
      volume: ambience.volume / 100,
      onload: () => {
        if (!ambience.isAudioLoaded) {
          ambience.isAudioLoaded = true
          const duration = ambience.audio!.duration() * 1000 // duration in milliseconds
          get().playLoop(ambience, duration)
        }
      },
      onloaderror: (_, error) => {
        throw new Error(`Failed to load ambience: ${soundSrc}, Error: ${error}`)
      },
    })

    return ambience
  },

  deleteAmbienceAudio: (ambience: IAmbience) => {
    if (ambience.audio) {
      ambience.audio!.stop()
    }

    return ambience
  },

  playLoop: (ambience: IAmbience, ms: number) => {
    if (!ambience || !ambience.audio) return

    // play the audio
    ambience.audio!.play()

    // ensure there's no running timeout for this ambience
    if (ambience.loopTimeoutId) {
      clearTimeout(ambience.loopTimeoutId)
      ambience.loopTimeoutId = null
    }

    ambience.loopTimeoutId = setTimeout(() => {
      get().playLoop(ambience, ms)
    }, ms - 200)

    set({
      ambiences: get().ambiences.map((e) =>
        e.id === ambience.id ? ambience : e,
      ),
    })
  },
}))

export default useAmbiencesStore
