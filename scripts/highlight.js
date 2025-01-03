window.getXPath = (node) => {
  if (!node) return null // Handle invalid node input
  if (node.id) {
    console.log(`Node has ID, generating XPath: //*[@id="${node.id}"]`)
    return `//*[@id="${node.id}"]`
  }
  if (node === document.body) {
    console.log('Node is body, returning XPath: /html/body')
    return '/html/body'
  }

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

window.saveHighlightData = (positionData) => {
  console.log('Saving position data to localStorage:', positionData)

  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')

  storedData[baseUrl] = storedData[baseUrl] || []
  storedData[baseUrl].push(positionData)

  localStorage.setItem('highlights', JSON.stringify(storedData))

  // console.log('Updated localStorage:', storedData)
}

window.applyHighlight = (textNode, startOffset, endOffset, styles, color) => {
  console.log('Applying highlight:', {
    textNode,
    startOffset,
    endOffset,
    color,
  })

  const originalText = textNode.nodeValue
  const beforeText = originalText.slice(0, startOffset)
  const highlightedText = originalText.slice(startOffset, endOffset)
  const afterText = originalText.slice(endOffset)

  // Create a <span> element for the highlighted text
  const span = document.createElement('span')
  span.textContent = highlightedText
  Object.assign(span.style, styles)
  span.style.backgroundColor = color

  // Replace the original text node with the modified content
  const parentNode = textNode.parentNode
  const beforeNode = document.createTextNode(beforeText)
  const afterNode = document.createTextNode(afterText)

  parentNode.replaceChild(afterNode, textNode)
  parentNode.insertBefore(span, afterNode)
  parentNode.insertBefore(beforeNode, span)

  // console.log('Highlight applied successfully.')
}

window.highlightText = (selectedText, styles, color) => {
  console.log('-------------')
  console.log('highlightText called with:', {
    selectedText,
    styles,
    color,
  })

  const selection = window.getSelection()
  if (selection.rangeCount === 0) {
    console.error('No selection available.')
    return
  }

  const range = selection.getRangeAt(0)
  const textNode =
    range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer
      : range.startContainer.firstChild

  if (!textNode) {
    console.error('No valid text node found.')
    return
  }

  const xpath = window.getXPath(
    textNode.nodeType === Node.TEXT_NODE ? textNode.parentNode : textNode,
  )

  console.log('Calculated XPath:', xpath)

  const startOffset = range.startOffset
  const endOffset = range.endOffset

  const positionData = {
    selectedText,
    xpath,
    startOffset,
    endOffset,
    color,
  }

  console.log('Position Data:', positionData)

  window.saveHighlightData(positionData)
  window.applyHighlight(textNode, startOffset, endOffset, styles, color)
}

window.initializeHighlightWithPalette = (styles, colors, currentColor) => {
  console.log('Initializing highlight with palette...')
  let currentRange = null
  const palette = document.createElement('div')

  palette.className = 'floating-palette'
  palette.style.position = 'absolute'
  palette.style.display = 'none'
  palette.style.zIndex = '1000'
  palette.style.padding = '8px'
  palette.style.backgroundColor = '#ffffff'
  palette.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'
  palette.style.borderRadius = '8px'
  palette.style.display = 'flex'
  palette.style.gap = '4px'

  colors.forEach((color) => {
    const colorOption = document.createElement('div')
    colorOption.style.width = '20px'
    colorOption.style.height = '20px'
    colorOption.style.backgroundColor = color
    colorOption.style.borderRadius = '50%'
    colorOption.style.cursor = 'pointer'
    colorOption.style.border =
      color === currentColor ? '1px solid black' : 'none'

    colorOption.addEventListener('click', () => {
      if (currentRange) {
        const selectedText = currentRange.toString().trim()
        if (selectedText) {
          // Calculate XPath and Normalize Offsets
          const container =
            currentRange.startContainer.nodeType === Node.TEXT_NODE
              ? currentRange.startContainer.parentNode
              : currentRange.startContainer

          const xpath = window.getXPath(container)
          const originalText =
            container.dataset.originalText || container.innerText

          const startOffset = originalText.indexOf(selectedText)
          const endOffset = startOffset + selectedText.length

          if (startOffset === -1) {
            console.error('Selected text not found in original content.')
            return
          }

          const data = {
            selectedText,
            xpath,
            startOffset,
            endOffset,
            color,
          }
          console.log('Highlight Data:', data)

          window.saveHighlightData(data)
          window.highlightWithXPath(data)

          chrome.runtime
            .sendMessage({
              type: 'update-highlight-color',
              color,
            })
            .then()
        } else {
          console.error('No text selected for highlighting.')
        }
      }
      palette.style.display = 'none' // Hide the palette
    })

    palette.appendChild(colorOption)
  })

  document.body.appendChild(palette)

  document.addEventListener('mouseup', () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      currentRange = selection.getRangeAt(0)
      const rect = currentRange.getBoundingClientRect()

      palette.style.top = `${window.scrollY + rect.top - 40}px`
      palette.style.left = `${window.scrollX + rect.left}px`
      palette.style.display = 'flex'
    } else {
      palette.style.display = 'none'
    }
  })

  document.addEventListener('mousedown', (event) => {
    if (!palette.contains(event.target)) {
      palette.style.display = 'none'
    }
  })
}

// Restore previously saved highlights
window.restoreHighlights = () => {
  const getBaseUrl = () => {
    const url = new URL(window.location.href)
    return `${url.origin}${url.pathname}`
  }

  const baseUrl = getBaseUrl()
  const highlights = JSON.parse(localStorage.getItem('highlights') || '{}')[
    baseUrl
  ]

  if (!highlights || highlights.length === 0) {
    console.log('No highlights to restore for this site.')
    return
  }

  // highlights.sort((a, b) => b.startOffset - a.startOffset)
  highlights.forEach((data) => {
    window.highlightWithXPath(data)
  })

  // console.log('Highlights restored successfully.')
}

window.highlightWithXPath = ({
  selectedText,
  xpath,
  startOffset,
  endOffset,
  color,
}) => {
  console.log('-------------- Highlighting with XPath:', {
    selectedText,
    xpath,
    startOffset,
    endOffset,
    color,
  })

  const evaluator = new XPathEvaluator()
  const result = evaluator.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  )

  const container = result.singleNodeValue
  if (!container) {
    console.error('Failed to locate container for XPath:', xpath)
    return
  }

  // Retrieve all text nodes within the container
  const textNodes = []
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  )
  let node
  while ((node = walker.nextNode())) {
    textNodes.push(node)
  }

  if (textNodes.length === 0) {
    console.error('No text nodes found within container.')
    return
  }

  let cumulativeOffset = 0
  let targetNode = null
  let nodeStartOffset = 0
  let nodeEndOffset = 0

  // Find the specific text node and calculate relative offsets
  for (const textNode of textNodes) {
    const nodeText = textNode.nodeValue || ''
    const nodeLength = nodeText.length

    if (startOffset < cumulativeOffset + nodeLength) {
      targetNode = textNode
      nodeStartOffset = startOffset - cumulativeOffset
      nodeEndOffset = Math.min(endOffset - cumulativeOffset, nodeLength)
      break
    }
    cumulativeOffset += nodeLength
  }

  if (!targetNode) {
    console.error('Target text node not found.')
    return
  }

  // Validate the offsets
  if (nodeStartOffset < 0 || nodeEndOffset > targetNode.nodeValue.length) {
    console.error('Adjusted offsets are out of bounds:', {
      nodeStartOffset,
      nodeEndOffset,
    })
    return
  }

  // console.log('Target text node:', targetNode.nodeValue)
  console.log('Adjusted offsets:', { nodeStartOffset, nodeEndOffset })

  // Apply the highlight
  const range = document.createRange()
  range.setStart(targetNode, nodeStartOffset)
  range.setEnd(targetNode, nodeEndOffset)

  const span = document.createElement('span')
  span.style.backgroundColor = color
  span.style.color = '#000'
  span.style.borderRadius = '4px'
  span.style.padding = '2px 4px'

  span.textContent = range.toString()
  range.deleteContents()
  range.insertNode(span)

  // console.log('Highlight applied successfully.')
}
