import { create } from 'zustand'
import { IEffect, IEffectStore } from '@/modules/effect/types.ts'
import listEffects, {
  DEFAULT_VOLUME_VALUE,
} from '@/modules/effect/list-effects.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { Howl } from 'howler'

const MAX_ADDED_EFFECTS = 3

const useEffectStore = create<IEffectStore>((set, get) => ({
  effects: [],
  addedEffects: [],
  initEffects: () => {
    const effects = listEffects()
    set({ effects })
  },

  uniqueEffects: (effects: IEffect[]) => {
    const effectMap = new Map<string, IEffect>()

    effects.forEach((effect) => {
      effectMap.set(effect.id, effect)
    })

    return Array.from(effectMap.values())
  },

  getEffectById: (id: string) => {
    return get().effects.find((e) => e.id === id)
  },

  addEffectById: async (id: string) => {
    const { effects, addedEffects } = get()

    const effect = effects.find((e) => e.id === id)
    if (!effect) return

    const isAdded = addedEffects.findIndex((e) => e.id === id) > -1
    if (isAdded) return

    const modificationEffect = { ...effect }
    modificationEffect.volume = 0
    modificationEffect.mutedVolume = DEFAULT_VOLUME_VALUE
    addedEffects.push(modificationEffect)

    set({
      addedEffects,
    })
  },

  removeAllAddedEffects: () => {
    const { addedEffects, deleteEffectAudio } = get()

    for (const effect of addedEffects) {
      deleteEffectAudio(effect)
    }

    set({
      addedEffects: [],
    })
  },

  toggleEffect: async (id: string) => {
    const { effects, addedEffects } = get()

    const effect = effects.find((e) => e.id === id)
    if (!effect) return

    const addedIndex = addedEffects.findIndex((e) => e.id === id)
    const isAdded = addedIndex > -1
    if (!isAdded && addedEffects.length >= MAX_ADDED_EFFECTS) {
      const { showErrorNotification } = useNotificationStore.getState()
      showErrorNotification({
        description: 'You can only add up to 3 effects at a time',
      })

      return
    }

    if (!isAdded) {
      let modificationEffect = { ...effect }
      modificationEffect = await get().addEffectAudio(modificationEffect)
      addedEffects.push(modificationEffect)
      set({
        addedEffects,
      })
    } else {
      addedEffects[addedIndex] = get().deleteEffectAudio(
        addedEffects[addedIndex],
      )
      if (addedEffects[addedIndex].loopTimeoutId) {
        clearTimeout(addedEffects[addedIndex].loopTimeoutId)
        addedEffects[addedIndex].loopTimeoutId = null
      }
      delete addedEffects[addedIndex]
      addedEffects.splice(addedIndex, 1)
      set({
        addedEffects,
      })
    }
  },

  changeVolumeValue: (id: string, value: number) => {
    const { addedEffects } = get()
    const effect = addedEffects.find((e) => e.id === id)
    if (!effect || !effect.audio) return

    const modificationEffect = { ...effect }
    modificationEffect.audio!.volume(value / 100)
    modificationEffect.volume = value

    set({
      addedEffects: addedEffects.map((e) =>
        e.id === id ? modificationEffect : e,
      ),
    })
  },

  toggleMute: async (id: string) => {
    const { addedEffects } = get()
    let effect = addedEffects.find((e) => e.id === id)
    if (!effect) return

    if (!effect.audio) {
      effect = await get().addEffectAudio(effect)
    }

    const modificationEffect = { ...effect }
    if (modificationEffect.audio!.volume() > 0) {
      modificationEffect.audio!.volume(0)
      modificationEffect.mutedVolume = modificationEffect.volume
      modificationEffect.volume = 0
    } else {
      modificationEffect.volume = modificationEffect.mutedVolume
      modificationEffect.mutedVolume = 0
      modificationEffect.audio!.volume(modificationEffect.volume / 100)
    }

    set({
      addedEffects: addedEffects.map((e) =>
        e.id === id ? modificationEffect : e,
      ),
    })
  },

  addEffectAudio: async (effect: IEffect): Promise<IEffect> => {
    if (!effect || effect.audio) {
      return effect
    }

    const soundSrc = `${import.meta.env.BASE_URL}effects/${effect.file}`
    effect.audio = new Howl({
      src: [soundSrc],
      loop: false,
      html5: true,
      preload: true,
      volume: effect.volume / 100,
      onload: () => {
        if (!effect.isAudioLoaded) {
          effect.isAudioLoaded = true
          const duration = effect.audio!.duration() * 1000 // Duration in milliseconds
          // console.log(effect.id, ': duration', duration)
          get().playLoop(effect.id, duration)
        }
      },
      onloaderror: (_, error) => {
        throw new Error(
          `Failed to load sound effect: ${soundSrc}, Error: ${error}`,
        )
      },
    })

    return effect
  },

  deleteEffectAudio: (effect: IEffect) => {
    if (effect.audio) {
      effect.audio!.stop()
      effect.audio!.unload()
      effect.audio = undefined
    }

    return effect
  },

  playLoop: (id: string, ms: number) => {
    const { addedEffects } = get()
    const effect = addedEffects.find((e) => e.id === id)
    if (!effect || !effect.audio) return

    // Play the audio
    effect.audio!.play()

    // Ensure there's no running timeout for this effect
    if (effect.loopTimeoutId) {
      clearTimeout(effect.loopTimeoutId)
      effect.loopTimeoutId = null
    }

    effect.loopTimeoutId = setTimeout(() => {
      get().playLoop(effect.id, ms)
    }, ms - 200)

    set({
      addedEffects: addedEffects.map((e) => (e.id === id ? effect : e)),
    })
  },
}))

export default useEffectStore
