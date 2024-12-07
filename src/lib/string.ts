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

export {
  copyToClipboard,
  getDomainForDisplaying,
  getDomain,
  validateAndExtractHostname,
}
