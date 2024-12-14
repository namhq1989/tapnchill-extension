let offScreenCreating

export const createOffscreen = async () => {
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
