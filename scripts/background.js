import {
  createNoteInIndexedDB,
  deleteNoteFromIndexedDB,
  fetchNotesFromIndexedDB,
  getNotesLastSyncAt,
  persistNotesWithOrderInIndexedDB,
  updateNoteInIndexedDB,
  updateNotesLastSyncAt,
} from './note.js'

const LISTENING_TRACKING_INTERVAL = 60000 // 1 minute
// const LISTENING_TRACKING_INTERVAL = 5000 // 1 minute
const LISTENING_TRACKING_RETENTION_ITEMS = 30

chrome.runtime.onStartup.addListener(function () {
  chrome.storage.local
    .set({
      isStationPlaying: false,
      isAmbiencePlaying: false,
      lastTrackingTime: '',
    })
    .then()
})

let trackListeningTimeJobIntervalId

if (!trackListeningTimeJobIntervalId) {
  trackListeningTimeJobIntervalId = setInterval(() => {
    chrome.storage.local.get((result) => {
      const { isStationPlaying, isAmbiencePlaying } = result
      if (!isStationPlaying && !isAmbiencePlaying) return

      const now = new Date()
      let { lastTrackingTime } = result
      if (!lastTrackingTime) {
        lastTrackingTime = new Date(now.getTime() - LISTENING_TRACKING_INTERVAL)
      } else {
        const ts = Date.parse(lastTrackingTime)
        lastTrackingTime = new Date(ts)
      }

      const listeningTime = Math.round(
        (now.getTime() - lastTrackingTime.getTime()) / 1000, // in seconds
      )

      let { listeningTrackingTimeData } = result
      if (!listeningTrackingTimeData) {
        listeningTrackingTimeData = []
      }

      const date = formatDateToDDMM(now)
      let itemIndex = listeningTrackingTimeData.findIndex(
        (i) => i.date === date,
      )
      if (itemIndex === -1) {
        listeningTrackingTimeData.unshift({
          ts: now.getTime(),
          date,
          seconds: listeningTime,
        })
      } else {
        listeningTrackingTimeData[itemIndex].ts = now.getTime()
        listeningTrackingTimeData[itemIndex].seconds += listeningTime
      }

      // sort and delete entries that has index > LISTENING_TRACKING_RETENTION_ITEMS
      listeningTrackingTimeData.sort((a, b) => a.ts - b.ts)
      if (
        listeningTrackingTimeData.length > LISTENING_TRACKING_RETENTION_ITEMS
      ) {
        listeningTrackingTimeData.splice(
          0,
          listeningTrackingTimeData.length - LISTENING_TRACKING_RETENTION_ITEMS,
        )
      }

      chrome.storage.local
        .set({
          lastTrackingTime: now.toISOString(),
          listeningTrackingTimeData,
        })
        .then()
    })
  }, LISTENING_TRACKING_INTERVAL)
}

const formatDateToDDMM = (isoDateStr) => {
  const date = new Date(isoDateStr)
  const day = String(date.getDate()).padStart(2, '0') // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  return `${day}/${month}`
}

const setBadge = () => {
  chrome.action.setBadgeBackgroundColor({ color: '#facc15' }).then()
  chrome.action.setBadgeText({ text: '♬' }).then()
  chrome.action.setBadgeTextColor({ color: '#000' }).then()
}

const resetBadge = () => {
  chrome.action.setBadgeText({ text: '' }).then()
}

const getLastTrackingTime = (result) => {
  let lastTrackingTime = result.lastTrackingTime || ''
  if (!lastTrackingTime) {
    lastTrackingTime = new Date().toISOString()
  }

  const ts = Date.parse(lastTrackingTime)
  const lastTrackingTimeDate = new Date(ts)
  const now = new Date()
  if (
    now.getTime() - lastTrackingTimeDate.getTime() >
    LISTENING_TRACKING_INTERVAL
  ) {
    lastTrackingTime = now.toISOString()
  }

  return lastTrackingTime
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // console.log('request', request)
  if (request.type === 'get-listening-tracking-time-data') {
    chrome.storage.local.get((result) => {
      const { listeningTrackingTimeData } = result
      sendResponse({ data: listeningTrackingTimeData || [] })
    })

    return true
  } else if (request.type === 'station-is-playing') {
    setBadge()

    chrome.storage.local.get((result) => {
      const lastTrackingTime = getLastTrackingTime(result)
      chrome.storage.local
        .set({
          isStationPlaying: true,
          lastTrackingTime,
        })
        .then()
    })
  } else if (request.type === 'station-is-stopped') {
    resetBadge()

    chrome.storage.local.set({
      isStationPlaying: false,
    })
  } else if (request.type === 'ambience-is-playing') {
    setBadge()

    chrome.storage.local.get((result) => {
      const lastTrackingTime = getLastTrackingTime(result)
      chrome.storage.local
        .set({
          isAmbiencePlaying: true,
          lastTrackingTime,
        })
        .then()
    })
  } else if (request.type === 'ambience-is-stopped') {
    resetBadge()

    const { totalPlaying } = request
    chrome.storage.local.set({
      isAmbiencePlaying: totalPlaying > 0,
    })
  } else if (request.type === 'play-ambience') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-play-ambience' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'pause-ambience') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-pause-ambience' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'change-ambience-volume') {
    chrome.runtime
      .sendMessage({ ...request, type: 'offscreen-change-ambience-volume' })
      .then(() => {
        sendResponse({
          success: true,
        })
      })
  } else if (request.type === 'play-station') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-play-station' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'pause-station') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-pause-station' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'resume-station') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-resume-station' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'stop-station') {
    createOffscreen()
      .then(() => {
        chrome.runtime
          .sendMessage({ ...request, type: 'offscreen-stop-station' })
          .then(() => {
            sendResponse({
              success: true,
            })
          })
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })
  } else if (request.type === 'change-station-volume') {
    chrome.runtime
      .sendMessage({ ...request, type: 'offscreen-change-station-volume' })
      .then(() => {
        sendResponse({
          success: true,
        })
      })
  } else if (request.type === 'sign-in-with-google') {
    createOffscreen()
      .then(() => {
        chrome.runtime.sendMessage(
          { ...request, type: 'offscreen-sign-in-with-google' },
          (response) => {
            if (response.success) {
              chrome.storage.local
                .set({
                  accessToken: response.accessToken,
                  userId: response.userId,
                  provider: response.provider,
                  isSignedInSuccessfully: true,
                })
                .then(() => {
                  sendResponse({
                    success: true,
                    accessToken: response.accessToken,
                    userId: response.userId,
                    provider: response.provider,
                    isSignedInSuccessfully: true,
                  })
                })
            } else {
              sendResponse(response)
            }
          },
        )
      })
      .catch((error) => {
        console.error('Failed to create offscreen document:', error)
        sendResponse({ success: false })
      })

    return true
  } else if (request.type === 'get-notes-last-sync-at') {
    getNotesLastSyncAt()
      .then((lastSyncedAt) => sendResponse({ success: true, lastSyncedAt }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'update-notes-last-sync-at') {
    updateNotesLastSyncAt(request.lastSyncedAt)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'fetch-notes-in-indexeddb') {
    const { page, pageSize } = request
    fetchNotesFromIndexedDB(page, pageSize)
      .then((notes) => sendResponse({ success: true, notes }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'persist-notes-with-order-in-indexeddb') {
    persistNotesWithOrderInIndexedDB(request.payload)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'create-note-in-indexeddb') {
    createNoteInIndexedDB(request.payload)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'update-note-in-indexeddb') {
    updateNoteInIndexedDB(request.payload)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else if (request.type === 'delete-note-in-indexeddb') {
    deleteNoteFromIndexedDB(request.payload.id)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }))
    return true
  } else {
    sendResponse({
      success: false,
      message: 'Unknown action type',
    })
  }
})

let offScreenCreating

const createOffscreen = async () => {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html')
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl],
  })
  if (existingContexts.length > 0) {
    return
  }

  // create offscreen document
  if (offScreenCreating) {
    await offScreenCreating
  } else {
    offScreenCreating = chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: ['AUDIO_PLAYBACK', 'DOM_SCRAPING'],
      justification:
        'Keep audio playing in the background and handle Google Sign-In for authentication',
    })
    await offScreenCreating
    offScreenCreating = null
  }
}
