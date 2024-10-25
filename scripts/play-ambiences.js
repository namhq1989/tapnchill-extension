const loadHowler = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('howler.min.js')
    script.onload = () => resolve(window.Howl)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const ambienceInstances = new Map()

const playAmbience = async (id, audioUrl, volume) => {
  if (ambienceInstances.has(id) && ambienceInstances.get(id).isPlaying) {
    // return if already playing
    return
  }

  let ambience = ambienceInstances.get(id)
  if (ambience) {
    // if already exists, just play
    playLoop(ambience)
    return
  }

  ambience = {
    id,
    isPlaying: true,
    isAudioLoaded: true,
    loopTimeoutId: null,
  }

  const Howl = await loadHowler()
  ambience.audio = new Howl({
    src: [audioUrl],
    loop: false,
    html5: true,
    preload: true,
    volume: volume / 100,
    onload: () => {
      playLoop(ambience)
    },
    onloaderror: (id, error) => {
      throw new Error(`Failed to load ambience: ${audioUrl}, Error: ${error}`)
    },
  })

  ambienceInstances.set(id, ambience)
}

const pauseAmbience = (id) => {
  const ambience = ambienceInstances.get(id)
  if (!ambience) return

  ambience.audio.stop()
}

const setAmbienceVolume = (id, volume) => {
  const ambience = ambienceInstances.get(id)
  if (!ambience) return

  ambience.audio.volume(volume / 100)
}

const playLoop = (ambience) => {
  const durationMs = ambience.audio.duration() * 1000

  // play the audio
  ambience.audio.play()

  // ensure there's no running timeout for this ambience
  if (ambience.loopTimeoutId) {
    clearTimeout(ambience.loopTimeoutId)
    ambience.loopTimeoutId = null
  }

  // new play session
  ambience.loopTimeoutId = setTimeout(() => {
    playLoop(ambience)
  }, durationMs - 200)

  ambienceInstances.set(ambience.id, ambience)
}

export { playAmbience, pauseAmbience, setAmbienceVolume }
