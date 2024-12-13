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
