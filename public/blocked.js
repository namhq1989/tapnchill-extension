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
document.getElementById('site-name').textContent = getSiteName()

// Back button functionality
function goBack() {
  history.go(-2)
}

document.getElementById('back-button').addEventListener('click', goBack)
