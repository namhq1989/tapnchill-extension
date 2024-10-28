const log = (data) => {
  chrome.runtime.sendMessage({ type: 'offscreen-logs', data }).then()
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'offscreen-play-ambience') {
    playAmbience(request.id, request.audioUrl, request.volume).then()
  } else if (request.type === 'offscreen-pause-ambience') {
    pauseAmbience(request.id)
  } else if (request.type === 'offscreen-change-ambience-volume') {
    setAmbienceVolume(request.id, request.volume)
  }
})

const ambienceInstances = new Map()

const playAmbience = async (id, audioUrl, volume) => {
  if (ambienceInstances.has(id) && ambienceInstances.get(id).isPlaying) {
    // return if already playing
    return
  }

  let ambience = ambienceInstances.get(id)
  if (ambience) {
    // if already exists, just play
    ambience.audio.play()
    return
  }

  ambience = {
    id,
    isPlaying: true,
    isAudioLoaded: true,
    loopTimeoutId: null,
  }

  ambience.audio = new Howl({
    src: [audioUrl],
    autoplay: true,
    html5: true,
    preload: true,
    volume: volume / 100,
    onplay: () => {
      ambience.oldLoopTimeoutId = ambience.currentLoopTimeoutId

      const durationMs = ambience.audio.duration() * 1000
      ambience.currentLoopTimeoutId = setTimeout(() => {
        clearTimeout(ambience.oldLoopTimeoutId)
        ambience.oldLoopTimeoutId = null
        ambience.audio.play()
      }, durationMs - 50)
    },
    onstop: () => {
      clearTimeout(ambience.oldLoopTimeoutId)
    },
  })

  chrome.runtime.sendMessage({ type: 'offscreen-logs', data: 4 }).then()

  ambienceInstances.set(id, ambience)
}

const pauseAmbience = (id) => {
  if (!ambienceInstances.get(id)) return

  ambienceInstances.get(id).audio.stop()
  ambienceInstances.get(id).isPlaying = false
  clearTimeout(ambienceInstances.get(id).currentLoopTimeoutId)
  clearTimeout(ambienceInstances.get(id).oldLoopTimeoutId)
}

const setAmbienceVolume = (id, volume) => {
  if (!ambienceInstances.get(id)) return

  ambienceInstances.get(id).audio.volume(volume / 100)
}

//
// const playLoop = (ambience) => {
//   const durationMs = ambience.audio.duration() * 1000
//
//   // play the audio
//   ambience.audio.play()
//
//   // ensure there's no running timeout for this ambience
//   if (ambience.loopTimeoutId) {
//     clearTimeout(ambience.loopTimeoutId)
//     ambience.loopTimeoutId = null
//   }
//
//   // new play session
//   ambience.loopTimeoutId = setTimeout(() => {
//     playLoop(ambience)
//   }, durationMs - 200)
//
//   ambienceInstances.set(ambience.id, ambience)
// }
