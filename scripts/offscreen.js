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
  } else if (request.type === 'offscreen-play-station') {
    playStation(request.stationUrl, request.format, request.volume)
  } else if (request.type === 'offscreen-stop-station') {
    stopStation()
  } else if (request.type === 'offscreen-pause-station') {
    pauseStation()
  } else if (request.type === 'offscreen-resume-station') {
    resumeStation()
  } else if (request.type === 'offscreen-change-station-volume') {
    setStationVolume(request.volume)
  } else if (request.type === 'offscreen-sign-in-with-google') {
    handleGoogleSignIn((data) => {
      console.log('Data from handleGoogleSignIn:', data)

      // Send the user data back to the background script
      sendResponse(data)
    })
  }
  return true
})

//
// AMBIENCES
//

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
      }, durationMs - 200)
    },
    onstop: () => {
      clearTimeout(ambience.oldLoopTimeoutId)
    },
  })

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
// STATION
//

const stationInstance = {}

const playStation = (stationUrl, format, volume) => {
  if (stationInstance.audio) {
    stationInstance.audio.play()
    return
  }

  stationInstance.audio = new Howl({
    src: [stationUrl],
    format: [format],
    autoplay: true,
    html5: true,
    preload: true,
    volume: volume / 100,
    onplay: () => {
      chrome.runtime.sendMessage({ type: 'station-is-playing' }).then()
    },
    onstop: () => {
      chrome.runtime.sendMessage({ type: 'station-is-stopped' }).then()
    },
    onpause: () => {
      console.log('on pause')
    },
  })
}

const resumeStation = () => {
  if (!stationInstance.audio) return

  stationInstance.audio.play()
}

const pauseStation = () => {
  if (!stationInstance.audio) return

  stationInstance.audio.stop()
}

const stopStation = (id) => {
  if (!stationInstance.audio) return

  stationInstance.audio.stop()
  stationInstance.audio = undefined
  delete stationInstance.audio
}

const setStationVolume = (volume) => {
  if (!stationInstance.audio) return

  stationInstance.audio.volume(volume / 100)
}

//
// SIGN IN WITH GOOGLE
//

const _URL = 'https://bapbi-442401.web.app/signin.html'
console.log('Loading iframe with URL:', _URL)
// let iframe

const handleGoogleSignIn = (callback) => {
  let iframe = document.createElement('iframe')
  iframe.src = _URL
  iframe.style.display = 'none'

  iframe.onload = () => {
    console.log('Iframe loaded successfully')

    // Add the message listener
    window.addEventListener('message', function handleIframeMessage(event) {
      if (event.origin !== new URL(_URL).origin) {
        console.warn('Message received from unauthorized origin:', event.origin)
        return
      }

      console.log('Message received from iframe:', event.data)

      try {
        const data = JSON.parse(event.data)
        callback(data) // Send the data to the callback
        window.removeEventListener('message', handleIframeMessage)
        iframe.remove() // Clean up the iframe
      } catch (error) {
        console.error('Failed to parse message data:', error)
      }
    })

    // Send the initialization message to the iframe
    iframe.contentWindow.postMessage({ initAuth: true }, new URL(_URL).origin)
  }

  document.documentElement.appendChild(iframe)
}
