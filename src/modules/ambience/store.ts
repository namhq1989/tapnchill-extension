import { create } from 'zustand'
import { IAmbiencesStore, ISelectedAmbience } from '@/modules/ambience/types.ts'
import listAmbiences from '@/modules/ambience/list-ambiences.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import useAppStore from '@/modules/common/store.ts'

const { showErrorNotification } = useNotificationStore.getState()

const useAmbiencesStore = create<IAmbiencesStore>((set, get) => ({
  ambiences: [],
  initAmbiences: () => {
    chrome.storage.session.get((result) => {
      const selectedAmbiances: ISelectedAmbience[] =
        result.selectedAmbiances || []
      let ambiences = listAmbiences()
      if (!selectedAmbiances.length) {
        set({ ambiences })
      } else {
        ambiences = ambiences.map((a) => {
          const item = selectedAmbiances.find((sa) => sa.id === a.id)
          if (item) {
            a.isAdded = true
            a.volume = item.volume
          }
          return a
        })
        set({ ambiences })
      }
    })
  },

  toggleAmbience: async (id: string) => {
    const { ambiences } = get()

    const ambience = ambiences.find((e) => e.id === id)
    if (!ambience) return

    const totalAdded = ambiences.filter((e) => e.isAdded).length

    const { me } = useAppStore.getState()
    let maxAddedAmbiences = 2
    if (me?.subscription.plan === 'pro') {
      maxAddedAmbiences = 1000
    }
    if (!ambience.isAdded && totalAdded >= maxAddedAmbiences) {
      showErrorNotification({
        description: `You can only add up to ${maxAddedAmbiences} ambiences at a time`,
      })

      return
    }

    if (!ambience.isAdded) {
      chrome.runtime.sendMessage(
        {
          type: 'play-ambience',
          id: ambience.id,
          audioUrl: `${import.meta.env.VITE_CDN_ENDPOINT}/${ambience.file}`,
          volume: ambience.volume,
        },
        () => {
          ambience.isAdded = true
          set({
            ambiences: ambiences.map((e) => (e.id === id ? ambience : e)),
          })

          chrome.storage.session.get((result) => {
            const selectedAmbiances: ISelectedAmbience[] =
              result.selectedAmbiances || []
            selectedAmbiances.push({
              id: ambience.id,
              volume: ambience.volume,
            })
            chrome.storage.session.set({ selectedAmbiances })
            chrome.runtime.sendMessage({ type: 'ambience-is-playing' }).then()
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

          chrome.storage.session.get((result) => {
            const selectedAmbiances: ISelectedAmbience[] =
              result.selectedAmbiances || []
            const index = selectedAmbiances.findIndex(
              (sa) => sa.id === ambience.id,
            )
            selectedAmbiances.splice(index, 1)
            chrome.storage.session.set({ selectedAmbiances })
            chrome.runtime
              .sendMessage({
                type: 'ambience-is-stopped',
                totalPlaying: selectedAmbiances.length,
              })
              .then()
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

        chrome.storage.session.get((result) => {
          const selectedAmbiances: ISelectedAmbience[] =
            result.selectedAmbiances || []
          const index = selectedAmbiances.findIndex(
            (sa) => sa.id === ambience.id,
          )
          selectedAmbiances[index].volume = value
          chrome.storage.session.set({ selectedAmbiances })
        })
      },
    )
  },
}))

export default useAmbiencesStore
