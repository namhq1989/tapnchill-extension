const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then()
}

const DOMAIN_MAX_LENGTH = 30

const getDomain = (url: string): string => {
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

export { copyToClipboard, getDomain }
