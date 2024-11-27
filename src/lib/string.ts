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

export { copyToClipboard, getDomainForDisplaying, getDomain }
