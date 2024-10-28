chrome.runtime.onStartup.addListener(function () {
  chrome.storage.session.clear().then()
})

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // console.log('request', request)
  if (request.type === 'play-ambience') {
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
  } else {
    sendResponse({
      success: false,
      message: 'Unknown action type',
    })
  }

  return true
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
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play audio offscreen',
    })
    await offScreenCreating
    offScreenCreating = null
  }
}
