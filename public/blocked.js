// Function to extract the "site" parameter from the URL
function getSiteName() {
  try {
    const url = new URL(window.location.href)
    return url.searchParams.get('site') || 'this site'
  } catch (e) {
    console.error('Error parsing site parameter:', e)
    return 'this site'
  }
}

// Set the site name dynamically
document.getElementById('blocked-site').textContent = getSiteName()

// Back button functionality
function goBack() {
  // history.go(-2)
  window.close()
}

document.getElementById('back-button').addEventListener('click', goBack)

const quotes = [
  'Discipline is the bridge between goals and accomplishment.',
  'Focus on your goals. Distractions are temporary, achievements are forever.',
  'The key to success is to focus on goals, not obstacles.',
  "Every moment you stay focused, you're closer to your goals.",
  'Success demands singleness of purpose.',
]

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
document.querySelector('.quote').textContent = randomQuote

const updateRemainingTime = () => {
  chrome.storage.local.get('focusProgress', (result) => {
    const focusProgress = result.focusProgress
    if (focusProgress) {
      const { focusSeconds, status, lastUpdated } = focusProgress
      // Calculate the elapsed time since the last update
      const elapsed = Math.floor((Date.now() - lastUpdated) / 1000) // Convert to seconds
      const remainingTime = focusSeconds - elapsed
      if (status === 'running' && remainingTime > 0) {
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        const timeString = `${String(minutes).padStart(2, '0')}:${String(
          seconds,
        ).padStart(2, '0')}`
        document.querySelector('.remaining-time').textContent =
          `Remaining Time: ${timeString}`
      } else if (status === 'resting') {
        document.querySelector('.remaining-time').textContent =
          'You are resting.'
      } else if (status === 'paused') {
        // Session is paused
        document.querySelector('.remaining-time').textContent =
          'Focus session is paused.'
      } else {
        // Session ended (either countdown <= 0 or status is completed)
        document.querySelector('.remaining-time').textContent = 'Session Ended'
      }
    } else {
      document.querySelector('.remaining-time').textContent =
        'No active session.'
    }
  })
}
setInterval(updateRemainingTime, 1000)
updateRemainingTime()
