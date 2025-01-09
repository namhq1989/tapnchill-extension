import {
  createNoteInIndexedDB,
  deleteNoteFromIndexedDB,
  fetchNotesFromIndexedDB,
  getNotesLastSyncAt,
  persistNotesWithOrderInIndexedDB,
  updateNoteInIndexedDB,
  updateNotesLastSyncAt,
} from './note.js'
import {
  cleanupOldDailyMetrics,
  getLastNDaysMetrics,
  getOverallMetrics,
  getTodayMetrics,
  startSession,
  stopSession,
} from './focus.js'
import { createOffscreen } from './create-offscreen.js'

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

  chrome.alarms.clear('focusCountdown', () => {
    console.log('Focus alarm cleared on reset')
  })

  chrome.alarms.clear('breakCountdown', () => {
    console.log('Break alarm cleared on reset')
  })

  chrome.storage.local.set({ focusProgress: null }, () => {
    console.log('Focus state reset in local storage')
  })

  cleanupOldDailyMetrics()
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
    return true
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
    return true
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
    return true
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
    return true
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
    return true
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
                  email: response.email,
                  isSignedInSuccessfully: true,
                })
                .then(() => {
                  sendResponse({
                    success: true,
                    accessToken: response.accessToken,
                    userId: response.userId,
                    provider: response.provider,
                    email: response.email,
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
  } else if (request.type === 'focus-session-start') {
    startSession(
      request.data.focusSeconds,
      request.data.breakSeconds,
      request.data.numOfCycles,
    )
  } else if (request.type === 'focus-session-stop') {
    stopSession()
  } else if (request.type === 'get-focus-last-n-days-metrics') {
    getLastNDaysMetrics(request.days, (metrics) => {
      sendResponse({ data: metrics })
    })
    return true
  } else if (request.type === 'get-focus-overall-metrics') {
    getOverallMetrics((metrics) => {
      sendResponse({ data: metrics })
    })
    return true
  } else if (request.type === 'get-focus-today-metrics') {
    getTodayMetrics((metrics) => {
      sendResponse({ data: metrics })
    })
    return true
  } else if (request.type === 'update-highlight-color') {
    lastHighlightColor = request.color
    chrome.storage.local
      .set({
        lastHighlightColor: request.color,
      })
      .then()
  } else {
    sendResponse({
      success: false,
      message: 'Unknown action type',
    })
  }
})

//
// HIGHLIGHT
//

const HIGHLIGHT_STYLES = {
  color: '#000',
  'border-radius': '4px',
  padding: '2px 4px',
  display: 'inline',
  'word-break': 'break-word',
}

const HIGHLIGHT_COLORS = [
  '#a1a1aa',
  '#f87171',
  '#eab308',
  '#4d7c0f',
  '#60a5fa',
  '#a78bfa',
  '#e879f9',
]

const highlightInjectedTabs = new Set()
let lastHighlightColor = HIGHLIGHT_COLORS[0]

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    highlightInjectedTabs.delete(tabId)
    console.log(`Tab ${tabId} refreshed. Removed from injected tabs.`)
  } else if (changeInfo.status === 'complete') {
    chrome.storage.local.get('lastHighlightColor', (result) => {
      lastHighlightColor = result.lastHighlightColor || HIGHLIGHT_COLORS[0]
    })

    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ['highlight.js'], // Inject the logic
      })
      .then(() => {
        console.log(`Injected highlight.js into tab ${tabId}`)
        return chrome.scripting.executeScript({
          target: { tabId },
          func: (styles, colors) => {
            window.restoreHighlights(styles, colors)
          },
          args: [HIGHLIGHT_STYLES, HIGHLIGHT_COLORS],
        })
      })
      .then(() => {
        console.log('Highlights restored successfully.')
      })
      .catch((err) => console.error('Error restoring highlights:', err))
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  highlightInjectedTabs.delete(tabId)
})

chrome.contextMenus.removeAll(() => {
  // Root menu for BapBi
  chrome.contextMenus.create({
    id: 'bapbi-root',
    title: 'BapBi',
    contexts: ['all'],
  })

  // Submenu: Enable Highlight
  chrome.contextMenus.create({
    id: 'enable-highlight',
    parentId: 'bapbi-root',
    title: 'Enable Highlight',
    contexts: ['all'],
  })

  // Submenu: Highlight this text
  chrome.contextMenus.create({
    id: 'highlight-text',
    parentId: 'bapbi-root',
    title: 'Highlight this text',
    contexts: ['selection'],
  })
})

// Function to inject `highlight.js` and initialize the floating palette
const injectHighlightScript = (tabId) => {
  if (highlightInjectedTabs.has(tabId)) {
    console.log('Highlight.js already injected into this tab.')
    return Promise.resolve()
  }

  return chrome.scripting
    .executeScript({
      target: { tabId },
      files: ['highlight.js'], // Inject the file containing the logic
    })
    .then(() => {
      highlightInjectedTabs.add(tabId)
      console.log(`Highlight.js injected into tab ${tabId}`)
      return chrome.scripting.executeScript({
        target: { tabId },
        func: (styles, colors) => {
          window.initializeHighlightWithPalette(styles, colors)
        },
        args: [HIGHLIGHT_STYLES, HIGHLIGHT_COLORS],
      })
    })
    .catch((err) => console.error('Failed to inject highlight.js:', err))
}

// Handle menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'enable-highlight') {
    injectHighlightScript(tab.id).then(() => {
      console.log('Highlight enabled for the tab.')
    })
  } else if (info.menuItemId === 'highlight-text') {
    const highlightTextFunc = () => {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: (styles, text, color) => {
            window.highlightText(text, styles, color)
          },
          args: [
            HIGHLIGHT_STYLES,
            info.selectionText,
            lastHighlightColor || HIGHLIGHT_COLORS[0],
          ], // Default color
        })
        .then()
        .catch((err) => console.error('Failed to highlight text:', err))
    }

    injectHighlightScript(tab.id).then(highlightTextFunc)
  }
})
