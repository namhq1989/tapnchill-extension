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
    handleGoogleSignIn(request.userToken, (data) => {
      sendResponse(data)
    })

    return true
  }
  // return true
})

// chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
//   if (request.type === 'offscreen-sign-in-with-google') {
//     handleGoogleSignIn(request.userToken, (data) => {
//       sendResponse(data)
//     })
//   }
//   return true
// })

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
// let iframe

const handleGoogleSignIn = (userToken, callback) => {
  let iframe = document.createElement('iframe')
  iframe.src = _URL
  iframe.style.display = 'none'

  iframe.onload = () => {
    // Add the message listener
    window.addEventListener(
      'message',
      async function handleIframeMessage(event) {
        if (event.origin !== new URL(_URL).origin) {
          console.warn(
            'Message received from unauthorized origin:',
            event.origin,
          )
          return
        }

        console.log('Message received from iframe:', event.data)

        try {
          const data = JSON.parse(event.data)
          console.log('parsed data', data)

          if (data.success) {
            // Send the access token to your API
            const apiResponse = await postGoogleSignInToken(
              userToken,
              data.user.stsTokenManager.accessToken,
            )

            // Pass the API response to the callback
            callback({
              success: true,
              accessToken: apiResponse.data.data.accessToken,
              userId: apiResponse.data.data.userId,
              provider: apiResponse.data.data.provider,
              email: apiResponse.data.data.email,
            })
          } else {
            console.error('Sign-in failed:', data.error)
            callback({ success: false, error: data.error })
          }

          window.removeEventListener('message', handleIframeMessage)
          iframe.remove() // Clean up the iframe
        } catch (error) {
          console.error('Failed to parse message data:', error)
        }
      },
    )

    // Send the initialization message to the iframe
    iframe.contentWindow.postMessage({ initAuth: true }, new URL(_URL).origin)
  }

  document.documentElement.appendChild(iframe)
}

const postGoogleSignInToken = async (userToken, googleToken) => {
  try {
    const response = await fetch(
      'http://localhost:3070/api/user/sign-in/google',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ token: googleToken }),
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    const result = await response.json()
    console.log('API Response:', result)

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to call API:', error)
    return { success: false, error: error.message }
  }
}
