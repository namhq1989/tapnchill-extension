window.highlightText = (styles, selectedText, color) => {
  const applyHighlightStyles = (element, styles) => {
    Object.assign(element.style, styles)
  }

  const getXPath = (node) => {
    if (node.id) {
      return `//*[@id="${node.id}"]`
    }
    if (node === document.body) {
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
    return `${getXPath(node.parentNode)}/${tagName}[${index}]`
  }

  const calculateOffsets = (originalText, selectedText) => {
    const selectionStart = originalText.indexOf(selectedText)
    const selectionEnd = selectionStart + selectedText.length

    return { startOffset: selectionStart, endOffset: selectionEnd }
  }

  const getBaseUrl = () => {
    const url = new URL(window.location.href)
    return `${url.origin}${url.pathname}`
  }

  const getFullTextFromRange = (range) => {
    const container = range.commonAncestorContainer
    if (container.nodeType === Node.TEXT_NODE) {
      return container.textContent
    } else {
      // For multi-node selections, merge text from all selected nodes
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return range.intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT
          },
        },
      )

      let fullText = ''
      while (walker.nextNode()) {
        fullText += walker.currentNode.textContent
      }
      return fullText
    }
  }

  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)

    // Locate the element containing the text
    const textNode =
      range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer
        : range.startContainer.firstChild

    if (!textNode) {
      console.error('No valid text node found.')
      return
    }

    const containerElement =
      textNode.nodeType === Node.TEXT_NODE ? textNode.parentNode : textNode

    // Get the original text content
    let originalText = containerElement.dataset.originalText

    // If originalText is not already set, store it
    if (!originalText) {
      originalText = containerElement.innerText
      containerElement.dataset.originalText = originalText
    }

    // Get the full selected text
    const fullSelectedText = getFullTextFromRange(range)

    // Calculate accurate offsets based on the original text
    const { startOffset, endOffset } = calculateOffsets(
      originalText,
      fullSelectedText,
    )

    if (startOffset === -1) {
      console.error('Selected text not found in original content.')
      return
    }

    // Save the highlight data
    const positionData = {
      xpath: getXPath(textNode),
      startOffset,
      endOffset,
      color,
    }

    const baseUrl = getBaseUrl()
    const highlights = JSON.parse(localStorage.getItem('highlights') || '{}')
    highlights[baseUrl] = highlights[baseUrl] || []
    highlights[baseUrl].push(positionData)
    localStorage.setItem('highlights', JSON.stringify(highlights))

    console.log('Saved highlights:', highlights)

    // Create a styled span for the highlight
    const span = document.createElement('span')
    applyHighlightStyles(span, { backgroundColor: color, ...styles })

    span.textContent = fullSelectedText

    range.deleteContents()
    range.insertNode(span)

    selection.removeAllRanges()
    const icon = document.querySelector('.floating-icon')
    if (icon) {
      icon.style.display = 'none'
    }
  }
}

window.initializeFloatingPaletteLogic = (styles, colors) => {
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

    colorOption.addEventListener('click', () => {
      if (currentRange) {
        const selectionText = currentRange.toString().trim()
        if (selectionText) {
          window.highlightText(styles, selectionText, color)
        }
      }
      palette.style.display = 'none'
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

  highlights.sort((a, b) => b.startOffset - a.startOffset)

  highlights.forEach(({ xpath, startOffset, endOffset, color }) => {
    const evaluator = new XPathEvaluator()
    const result = evaluator.evaluate(
      xpath.replace('/#text[1]', ''),
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    )

    const container = result.singleNodeValue

    if (!container) {
      console.error('Failed to locate element for XPath:', xpath)
      return
    }

    const textNode =
      container.nodeType === Node.TEXT_NODE ? container : container.firstChild
    if (!textNode) {
      console.error('No valid text node found.')
      return
    }

    if (startOffset < 0 || endOffset > textNode.textContent.length) {
      console.error('Offsets are out of bounds:', { startOffset, endOffset })
      return
    }

    const range = document.createRange()
    range.setStart(textNode, startOffset)
    range.setEnd(textNode, endOffset)

    const span = document.createElement('span')
    span.style.backgroundColor = color
    span.style.color = '#000'
    span.style.borderRadius = '4px'
    span.style.padding = '2px 4px'

    span.textContent = range.toString()
    range.deleteContents()
    range.insertNode(span)
  })

  console.log('Highlights restored successfully.')
}
