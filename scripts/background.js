// import { pauseAmbience, playAmbience } from './play-ambiences'
//
// chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
//   if (request.type === 'play-ambience') {
//     playAmbience(request.id, request.audioUrl, request.volume)
//     sendResponse({
//       success: true,
//     })
//   } else if (request.type === 'pause-ambience') {
//     pauseAmbience(request.id)
//     sendResponse({
//       success: true,
//     })
//   } else {
//     sendResponse({
//       success: false,
//       message: 'Unknown action type',
//     })
//   }
//
//   return true
// })

chrome.runtime.onMessage.addListener(async (request, _, sendResponse) => {
  console.log('request', request)
  await createOffscreen()
  console.log('1')
  await chrome.runtime.sendMessage({ x: '1' })
})

async function createOffscreen() {
  console.log('2')
  if (await chrome.offscreen.hasDocument()) return
  console.log('3')
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'testing', // details for using the API
  })
}
