// Function to calculate XPath for a given node
window.getXPath = (node) => {
  if (!node) return null
  if (node.id) return `//*[@id="${node.id}"]`
  if (node === document.body) return '/html/body'

  let index = 1
  let sibling = node.previousSibling

  while (sibling) {
    if (
      sibling.nodeType === Node.ELEMENT_NODE &&
      sibling.nodeName === node.nodeName
    ) {
      index++
    }
    sibling = sibling.previousSibling
  }

  const tagName = node.nodeName.toLowerCase()
  const parentXPath = window.getXPath(node.parentNode)
  return `${parentXPath}/${tagName}[${index}]`
}

// Function to get the original text content of an element using XPath
window.getOriginalTextFromXPath = (xpath) => {
  try {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    )

    const element = result.singleNodeValue
    if (!element) return null
    return element.textContent
  } catch (error) {
    return null
  }
}

window.isHighlightOverlapping = (newHighlight) => {
  const { xpath, startOffset, endOffset } = newHighlight

  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
  const existingHighlights = storedData[baseUrl] || []

  return existingHighlights.some((highlight) => {
    if (highlight.xpath !== xpath) return false
    return (
      (startOffset >= highlight.startOffset &&
        startOffset < highlight.endOffset) ||
      (endOffset > highlight.startOffset && endOffset <= highlight.endOffset) ||
      (startOffset <= highlight.startOffset && endOffset >= highlight.endOffset)
    )
  })
}

window.generateHighlightId = () =>
  `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

window.saveHighlightData = (positionData) => {
  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')

  storedData[baseUrl] = storedData[baseUrl] || []
  storedData[baseUrl].push(positionData)

  localStorage.setItem('highlights', JSON.stringify(storedData))
  return storedData[baseUrl]
}

window.removeHighlight = (span, id) => {
  const parentNode = span.parentNode
  const plainText = document.createTextNode(span.textContent)
  parentNode.replaceChild(plainText, span)

  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
  const highlights = storedData[baseUrl] || []
  storedData[baseUrl] = highlights.filter((highlight) => highlight.id !== id)
  localStorage.setItem('highlights', JSON.stringify(storedData))
}

window.applyHighlight = (
  id,
  textNode,
  startOffset,
  endOffset,
  styles,
  color,
) => {
  const originalText = textNode.nodeValue
  const beforeText = originalText.slice(0, startOffset)
  const highlightedText = originalText.slice(startOffset, endOffset)
  const afterText = originalText.slice(endOffset)

  const span = document.createElement('span')
  span.textContent = highlightedText
  Object.assign(span.style, styles)
  span.style.backgroundColor = color

  span.addEventListener('click', () => window.removeHighlight(span, id))

  const parentNode = textNode.parentNode
  const beforeNode = document.createTextNode(beforeText)
  const afterNode = document.createTextNode(afterText)

  parentNode.replaceChild(afterNode, textNode)
  parentNode.insertBefore(span, afterNode)
  parentNode.insertBefore(beforeNode, span)
}

window.rebuildHighlights = (highlights, styles, colors) => {
  const groupedHighlights = {}

  highlights.forEach(({ id, xpath, startOffset, endOffset, color }) => {
    if (!groupedHighlights[xpath]) {
      groupedHighlights[xpath] = []
    }
    groupedHighlights[xpath].push({
      id,
      startOffset,
      endOffset,
      color: color || colors[0],
    })
  })

  Object.entries(groupedHighlights).forEach(([xpath, highlightList]) => {
    const element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue

    if (!element) return

    const originalText = window.getOriginalTextFromXPath(xpath)
    if (!originalText) return

    highlightList.sort((a, b) => a.startOffset - b.startOffset)

    let currentIndex = 0
    const fragment = document.createDocumentFragment()

    highlightList.forEach(({ id, startOffset, endOffset, color }) => {
      if (startOffset > currentIndex) {
        const beforeText = originalText.slice(currentIndex, startOffset)
        fragment.appendChild(document.createTextNode(beforeText))
      }

      const highlightedText = originalText.slice(startOffset, endOffset)
      const span = document.createElement('span')
      span.textContent = highlightedText
      Object.assign(span.style, styles)
      span.style.backgroundColor = color

      span.addEventListener('click', () => window.removeHighlight(span, id))
      fragment.appendChild(span)

      currentIndex = endOffset
    })

    if (currentIndex < originalText.length) {
      const afterText = originalText.slice(currentIndex)
      fragment.appendChild(document.createTextNode(afterText))
    }

    while (element.firstChild) {
      element.removeChild(element.firstChild)
    }
    element.appendChild(fragment)
  })
}

window.highlightText = (selectedText, styles, color) => {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const textNode =
    range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer
      : range.startContainer.firstChild

  if (!textNode) return

  const xpath = window.getXPath(
    textNode.nodeType === Node.TEXT_NODE ? textNode.parentNode : textNode,
  )

  const originalText = window.getOriginalTextFromXPath(xpath)
  if (!originalText) return

  const startOffset = originalText.indexOf(selectedText)
  if (startOffset === -1) return
  const endOffset = startOffset + selectedText.length

  if (
    window.isHighlightOverlapping({
      xpath,
      startOffset,
      endOffset,
    })
  )
    return

  const id = window.generateHighlightId()

  const positionData = {
    id,
    selectedText,
    xpath,
    startOffset,
    endOffset,
    color,
  }

  const existingHighlights = window.saveHighlightData(positionData)
  window.rebuildHighlights(existingHighlights, styles)
}

window.restoreHighlights = (styles, colors) => {
  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
  const highlights = storedData[baseUrl] || []
  window.rebuildHighlights(highlights, styles, colors)
}

window.initializeHighlightWithPalette = (styles, colors, currentColor) => {
  let selectedData = null

  const palette = document.createElement('div')
  palette.className = 'floating-palette'
  Object.assign(palette.style, {
    position: 'absolute',
    display: 'none',
    zIndex: '1000',
    padding: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    gap: '4px',
  })

  colors.forEach((color) => {
    const colorOption = document.createElement('div')
    Object.assign(colorOption.style, {
      width: '20px',
      height: '20px',
      backgroundColor: color,
      borderRadius: '50%',
      cursor: 'pointer',
      border: color === currentColor ? '1px solid black' : 'none',
    })

    colorOption.addEventListener('click', () => {
      if (selectedData) {
        const { selectedText, xpath, startOffset, endOffset } = selectedData

        if (
          window.isHighlightOverlapping({
            xpath,
            startOffset,
            endOffset,
          })
        )
          return

        const highlightData = {
          id: window.generateHighlightId(),
          selectedText,
          xpath,
          startOffset,
          endOffset,
          color,
        }

        const existingHighlights = window.saveHighlightData(highlightData)
        window.rebuildHighlights(existingHighlights, styles)
      }
      palette.style.display = 'none'
    })

    palette.appendChild(colorOption)
  })

  document.body.appendChild(palette)

  document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection()

    if (palette.contains(event.target)) return

    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      const currentRange = selection.getRangeAt(0)

      const container =
        currentRange.startContainer.nodeType === Node.TEXT_NODE
          ? currentRange.startContainer.parentNode
          : currentRange.startContainer

      const xpath = window.getXPath(container)
      const originalText = window.getOriginalTextFromXPath(xpath)
      if (!originalText) return

      const selectedText = selection.toString().trim()
      const startOffset = originalText.indexOf(selectedText)
      const endOffset = startOffset + selectedText.length

      if (startOffset === -1) return

      if (
        window.isHighlightOverlapping({
          xpath,
          startOffset,
          endOffset,
        })
      )
        return

      selectedData = { selectedText, xpath, startOffset, endOffset }

      const rect = currentRange.getBoundingClientRect()
      palette.style.top = `${window.scrollY + rect.top - 40}px`
      palette.style.left = `${window.scrollX + rect.left}px`
      palette.style.display = 'flex'
    } else {
      palette.style.display = 'none'
      selectedData = null
    }
  })

  document.addEventListener('mousedown', (event) => {
    if (!palette.contains(event.target)) {
      palette.style.display = 'none'
    }
  })
}
