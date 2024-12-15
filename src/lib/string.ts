const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then()
}

const DOMAIN_MAX_LENGTH = 30

const getDomainForDisplaying = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    const domain = parsedUrl.hostname
    return domain.length > DOMAIN_MAX_LENGTH
      ? `${domain.slice(0, DOMAIN_MAX_LENGTH)}...`
      : domain
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}

const getDomain = (url: string): string => {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname
    return hostname.startsWith('www.') ? hostname.slice(4) : hostname
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}

const validateAndExtractHostname = (input: string): string | null => {
  try {
    // Ensure input is treated as a URL
    const url = new URL(input.startsWith('http') ? input : `https://${input}`)
    const hostname = url.hostname

    // Regular expression to validate a proper domain name
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/

    if (!domainRegex.test(hostname)) {
      console.error('Invalid domain format:', input)
      return null
    }

    return hostname
  } catch (error) {
    console.error('Invalid website address:', input, error)
    return null
  }
}

const formatNumber = (
  value: number,
  type: 'time' | 'number' = 'number',
): string => {
  if (value === 0) {
    return type === 'time' ? '0s' : '0'
  }

  if (type === 'time') {
    const hours = Math.floor(value / 3600)
    const minutes = Math.floor((value % 3600) / 60)
    const seconds = value % 60

    const pad = (n: number): string => n.toString().padStart(2, '0') // Add leading zero

    if (hours > 0) {
      return `${pad(hours)}h ${pad(minutes)}m`
    } else if (minutes > 0) {
      return `${pad(minutes)}m ${pad(seconds)}s`
    } else {
      return `${pad(seconds)}s`
    }
  } else if (type === 'number') {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    } else {
      return value.toString()
    }
  }

  return value.toString()
}

export {
  copyToClipboard,
  getDomainForDisplaying,
  getDomain,
  validateAndExtractHostname,
  formatNumber,
}
