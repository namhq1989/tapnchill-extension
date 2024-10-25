import { pauseAmbience, playAmbience } from './play-ambiences'

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'play-ambience') {
    playAmbience(request.id, request.audioUrl, request.volume)
    sendResponse({
      success: true,
    })
  } else if (request.type === 'pause-ambience') {
    pauseAmbience(request.id)
    sendResponse({
      success: true,
    })
  } else {
    sendResponse({
      success: false,
      message: 'Unknown action type',
    })
  }

  return true
})
