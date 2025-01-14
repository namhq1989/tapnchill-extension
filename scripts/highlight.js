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

window.isTagColliding = (xpath, startOffset, endOffset) => {
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue

  if (!element) {
    // console.warn(`Element not found for XPath: ${xpath}`)
    return false
  }

  // console.log('Checking for tag collision...')
  // console.log('Element found:', element)
  // console.log('Start Offset:', startOffset, 'End Offset:', endOffset)

  const fullText = element.textContent
  // console.log('Full Text:', fullText)

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      if (node.tagName === 'SPAN' && node.id?.startsWith('highlight-')) {
        // console.log(`Ignoring highlight span: ${node.outerHTML}`)
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  while (walker.nextNode()) {
    const node = walker.currentNode

    if (node.nodeType === Node.ELEMENT_NODE) {
      const nodeText = node.textContent || ''
      const nodeStart = fullText.indexOf(nodeText)
      const nodeEnd = nodeStart + nodeText.length

      // console.log(
      //   `Node: <${node.tagName.toLowerCase()}>`,
      //   `Node Start: ${nodeStart}`,
      //   `Node End: ${nodeEnd}`,
      //   `Node Text: "${nodeText}"`,
      // )

      if (
        (startOffset >= nodeStart && startOffset < nodeEnd) ||
        (endOffset > nodeStart && endOffset <= nodeEnd) ||
        (startOffset <= nodeStart && endOffset >= nodeEnd)
      ) {
        // console.log(
        //   `Collision detected with tag <${node.tagName.toLowerCase()}>`,
        // )
        return true
      }
    }
  }

  // console.log('No collision detected with any tags.')
  return false
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

  // Replace the span with its text content
  const plainText = document.createTextNode(span.textContent)
  parentNode.replaceChild(plainText, span)

  // Normalize the parent node to merge adjacent text nodes
  parentNode.normalize()

  // Update the highlights in localStorage
  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
  const highlights = storedData[baseUrl] || []
  storedData[baseUrl] = highlights.filter((highlight) => highlight.id !== id)
  localStorage.setItem('highlights', JSON.stringify(storedData))
}

// window.removeHighlight = (span, id) => {
//   const parentNode = span.parentNode
//   const plainText = document.createTextNode(span.textContent)
//   parentNode.replaceChild(plainText, span)
//
//   const baseUrl = `${location.origin}${location.pathname}`
//   const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
//   const highlights = storedData[baseUrl] || []
//   storedData[baseUrl] = highlights.filter((highlight) => highlight.id !== id)
//   localStorage.setItem('highlights', JSON.stringify(storedData))
// }

window.rebuildHighlights = (highlights, styles, colors) => {
  // console.log('Starting to rebuild highlights...')

  highlights.forEach(
    ({ id, xpath, selectedText, startOffset, endOffset, color }) => {
      // console.log(`Processing highlight with ID: ${id}`)
      // console.log(`XPath: ${xpath}`)
      // console.log(`Selected Text: "${selectedText}"`)
      // console.log(`Start Offset: ${startOffset}, End Offset: ${endOffset}`)

      // Find the target element using XPath
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue

      if (!element) {
        // console.warn(`Element not found for XPath: ${xpath}`)
        return
      }

      // console.log('Element found:', element)

      const innerHtml = element.innerHTML
      const innerText = element.textContent

      // console.log(`Inner Text: "${innerText}"`)
      // console.log(`Inner HTML: "${innerHtml}"`)

      // Determine the nth appearance of selectedText based on startOffset
      let currentOffset = 0
      let nth = 0
      let position = -1

      while (currentOffset < innerText.length) {
        position = innerText.indexOf(selectedText, currentOffset)
        if (position === -1) {
          console.warn(
            `"${selectedText}" not found beyond offset: ${currentOffset}`,
          )
          break
        }

        nth++
        // console.log(
        //   `Found "${selectedText}" at position ${position} (nth: ${nth})`,
        // )

        if (position >= startOffset) {
          // console.log(`Target occurrence found at nth: ${nth}`)
          break
        }

        currentOffset = position + selectedText.length
      }

      // If we couldn't find the correct nth appearance, skip this highlight
      if (nth === 0 || position === -1) {
        // console.warn(
        //   `Failed to determine the nth appearance for: "${selectedText}"`,
        // )
        return
      }

      // Use the provided color or fallback to the first color in the palette
      const highlightColor = color || colors[0] || '#ffff00' // Default to yellow if no color is provided

      // Replace the nth appearance of selectedText in innerHtml
      let count = 0
      // Log the updated HTML
      // console.log(`Updated Inner HTML: "${newHtml}"`)

      // Set the updated innerHTML
      element.innerHTML = innerHtml.replace(
        new RegExp(selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        (match) => {
          count++
          if (count === nth) {
            // console.log(
            //   `Replacing nth occurrence of "${match}" with a highlight.`,
            // )
            const styleString = Object.entries(styles)
              .map(([key, value]) => `${key}: ${value};`)
              .join(' ')
            return `<span id="${id}" style="background-color: ${highlightColor}; ${styleString}">${match}</span>`
          }
          return match
        },
      )

      // Add the click event to remove highlight
      setTimeout(() => {
        const span = document.getElementById(id)
        if (span) {
          span.addEventListener('click', () => {
            window.removeHighlight(span, id)
          })
        }
      }, 0)

      // console.log(`Successfully updated highlight for ID: ${id}`)
    },
  )

  // console.log('Finished rebuilding highlights', highlights.length)
}

window.highlightText = (selectedText, styles, color) => {
  const selection = window.getSelection()
  if (selection.rangeCount === 0) {
    // console.warn('No selection range found.')
    return
  }

  const range = selection.getRangeAt(0)
  const startContainer = range.startContainer

  const textNode =
    startContainer.nodeType === Node.TEXT_NODE
      ? startContainer
      : startContainer.firstChild

  if (!textNode) {
    // console.warn('No text node found in the selection.')
    return
  }

  const xpath = window.getXPath(
    textNode.nodeType === Node.TEXT_NODE ? textNode.parentNode : textNode,
  )
  // console.log('Calculated XPath:', xpath)

  // Fetch the cleaned text content (strip existing spans)
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue

  if (!element) {
    // console.warn('Element not found for the given XPath.')
    return
  }

  const clonedElement = element.cloneNode(true)
  const spans = clonedElement.querySelectorAll("span[id^='highlight-']")
  spans.forEach((span) => {
    span.outerHTML = span.innerHTML // Replace span tags with their content
  })

  const cleanText = clonedElement.textContent
  // console.log('Cleaned Text Content:', cleanText)

  // Calculate offsets in the cleaned text
  const selectedIndex = cleanText.indexOf(selectedText)
  if (selectedIndex === -1) {
    // console.warn(`Selected text "${selectedText}" not found in the element.`)
    return
  }

  const rangeStartOffset = range.startOffset
  const rangeEndOffset = range.endOffset

  // Match the correct occurrence based on the range's start offset
  let startOffset = -1
  let currentIndex = 0
  let occurrenceIndex = 0

  while (currentIndex < cleanText.length) {
    const position = cleanText.indexOf(selectedText, currentIndex)
    if (position === -1) break

    occurrenceIndex++
    const nodeText = textNode.nodeValue || textNode.textContent
    const nodeStartOffset = cleanText.indexOf(nodeText)

    const globalStartOffset = nodeStartOffset + rangeStartOffset
    if (position === globalStartOffset) {
      startOffset = position
      // console.log(
      //   `Matched occurrence ${occurrenceIndex} at position ${position}`,
      // )
      break
    }

    currentIndex = position + selectedText.length
  }

  if (startOffset === -1) {
    // console.warn('Failed to match the selected text with the current range.')
    return
  }

  const endOffset = startOffset + selectedText.length

  // console.log('Calculated Start Offset:', startOffset)
  // console.log('Calculated End Offset:', endOffset)

  // Check for collisions and overlaps
  if (
    window.isHighlightOverlapping({ xpath, startOffset, endOffset }) ||
    window.isTagColliding(xpath, startOffset, endOffset)
  ) {
    // window.showNotification(
    //   'Highlighting failed: overlap or collision detected.',
    // )
    return
  }

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
  // console.log('Position Data:', positionData)

  window.rebuildHighlights(existingHighlights, styles)
}

window.restoreHighlights = (styles, colors) => {
  // console.log('restoreHighlights')
  const baseUrl = `${location.origin}${location.pathname}`
  const storedData = JSON.parse(localStorage.getItem('highlights') || '{}')
  const highlights = storedData[baseUrl] || []

  if (highlights.length) {
    window.rebuildHighlights(highlights, styles, colors)
    window.showNotification(getHighlightMessage(highlights.length))
    window.createHighlightManager(highlights)
  }
}

window.initializeHighlightWithPalette = (styles, colors, currentColor) => {
  let selectedData = null

  // Create the floating palette element
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
    flexDirection: 'row',
  })

  // Add color options to the palette
  colors.forEach((color) => {
    const colorOption = document.createElement('div')
    Object.assign(colorOption.style, {
      width: '20px',
      height: '20px',
      backgroundColor: color,
      borderRadius: '50%',
      cursor: 'pointer',
      border: color === currentColor ? '2px solid black' : '1px solid #ccc',
    })

    // Add click event for each color
    colorOption.addEventListener('click', () => {
      // console.log('Palette color selected:', color)
      if (selectedData) {
        const { selectedText, xpath, startOffset, endOffset } = selectedData

        // console.log('Selected Data:', selectedData)

        if (
          window.isHighlightOverlapping({
            xpath,
            startOffset,
            endOffset,
          })
        ) {
          // window.showNotification(
          //   'Highlighting failed: overlapping with another highlight.',
          // )
          return
        }

        if (window.isTagColliding(xpath, startOffset, endOffset)) {
          // window.showNotification(
          //   'Highlighting failed: colliding with another tag.',
          // )
          return
        }

        const highlightData = {
          id: window.generateHighlightId(),
          selectedText,
          xpath,
          startOffset,
          endOffset,
          color,
        }

        // console.log('Highlight Data to Save:', highlightData)

        const existingHighlights = window.saveHighlightData(highlightData)
        window.rebuildHighlights(existingHighlights, styles)

        chrome.runtime
          .sendMessage({
            type: 'update-highlight-color',
            color,
          })
          .then()

        // console.log('Highlight applied with color:', color)
      }
      palette.style.display = 'none'
    })

    palette.appendChild(colorOption)
  })

  document.body.appendChild(palette)

  // Event listener for mouseup (text selection)
  document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection()

    if (palette.contains(event.target)) return

    if (selection.rangeCount > 0 && selection.toString().trim().length > 0) {
      const currentRange = selection.getRangeAt(0)

      // console.log('Selection Range:', currentRange)

      const container =
        currentRange.startContainer.nodeType === Node.TEXT_NODE
          ? currentRange.startContainer.parentNode
          : currentRange.startContainer

      const xpath = window.getXPath(container)
      // console.log('Calculated XPath:', xpath)

      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue

      if (!element) {
        // console.warn('Element not found for XPath:', xpath)
        return
      }

      // console.log('Element Found:', element)

      // Recalculate clean text after normalization
      element.normalize()
      const cleanText = element.textContent
      // console.log('Cleaned Text Content:', cleanText)

      const selectedText = selection.toString().trim()
      // console.log('Selected Text:', selectedText)

      let occurrenceIndex = 0
      let currentIndex = 0
      let startOffset = -1

      // console.log('Calculating Start Offset...')
      while (currentIndex < cleanText.length) {
        const position = cleanText.indexOf(selectedText, currentIndex)
        if (position === -1) break

        occurrenceIndex++
        const globalStart = position
        const rangeStart = currentRange.startOffset

        // console.log(
        //   `Occurrence ${occurrenceIndex} at Position: ${position}, Range Start: ${rangeStart}`,
        // )

        if (globalStart === rangeStart || occurrenceIndex === 1) {
          startOffset = position
          // console.log(
          //   `Matched Occurrence ${occurrenceIndex} at Position: ${position}`,
          // )
          break
        }

        currentIndex = position + selectedText.length
      }

      if (startOffset === -1) {
        // console.warn(`Unable to match the selected text "${selectedText}".`)
        return
      }

      const endOffset = startOffset + selectedText.length

      // console.log('Calculated Start Offset:', startOffset)
      // console.log('Calculated End Offset:', endOffset)

      if (
        window.isHighlightOverlapping({
          xpath,
          startOffset,
          endOffset,
        })
      ) {
        // window.showNotification(
        //   'Highlighting failed: overlapping with another highlight.',
        // )
        return
      }

      if (window.isTagColliding(xpath, startOffset, endOffset)) {
        // window.showNotification(
        //   'Highlighting failed: colliding with another tag.',
        // )
        return
      }

      selectedData = { selectedText, xpath, startOffset, endOffset }

      const rect = currentRange.getBoundingClientRect()
      // console.log('Selection Rectangle:', rect)
      palette.style.top = `${window.scrollY + rect.top - 40}px`
      palette.style.left = `${window.scrollX + rect.left}px`
      palette.style.display = 'flex'
    } else {
      palette.style.display = 'none'
      selectedData = null
    }
  })

  // Event listener for mousedown to hide the palette
  document.addEventListener('mousedown', (event) => {
    if (!palette.contains(event.target)) {
      palette.style.display = 'none'
    }
  })
}

window.createHighlightManager = (highlights) => {
  // Remove any existing manager if URL changes
  const existingContainer = document.getElementById(
    'highlight-manager-container',
  )
  if (existingContainer) existingContainer.remove()

  // Calculate the total number of highlights
  const totalHighlights = highlights.length

  // Create the container for the floating button and the expanded view
  const container = document.createElement('div')
  container.id = 'highlight-manager-container'
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: 10000,
  })

  // Create the button (Icon + Total Highlights)
  const button = document.createElement('button')
  button.id = 'highlight-manager-button'
  Object.assign(button.style, {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#000',
    fontSize: '14px',
    padding: '8px 12px',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  })

  // Add the icon to the button
  const icon = document.createElement('img')
  icon.src = chrome.runtime.getURL('icons/icon128.png') // Use the icon from the extension
  Object.assign(icon.style, {
    width: '16px',
    height: '16px',
  })
  button.appendChild(icon)

  // Add the text to the button
  const buttonText = document.createElement('span')
  buttonText.textContent = `${totalHighlights} highlights`
  button.appendChild(buttonText)

  // Create the collapsible view
  const collapsible = document.createElement('div')
  collapsible.id = 'highlight-manager-list'
  Object.assign(collapsible.style, {
    display: 'none', // Hidden initially
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '300px',
    position: 'absolute',
    bottom: '64px',
    right: '0',
    flexDirection: 'column',
    gap: '8px',
  })

  // Add the header to the collapsible view
  const header = document.createElement('div')
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  })

  const headerIcon = icon.cloneNode() // Reuse the button's icon
  const headerText = document.createElement('span')
  headerText.textContent = `${totalHighlights} highlights`
  Object.assign(headerText.style, {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#000',
  })

  header.appendChild(headerIcon)
  header.appendChild(headerText)
  collapsible.appendChild(header)

  // Populate the list with highlights
  highlights.forEach(({ selectedText }, index) => {
    const highlightItem = document.createElement('div')
    Object.assign(highlightItem.style, {
      padding: '8px 0',
      fontSize: '14px',
      color: '#000',
      cursor: 'pointer', // Add cursor pointer for interactivity
    })

    highlightItem.textContent = `${index + 1}. ${selectedText}`
    collapsible.appendChild(highlightItem)
  })

  // Toggle the view between compact and expanded
  let isExpanded = false
  button.addEventListener('click', () => {
    if (!isExpanded) {
      collapsible.style.display = 'flex'
    } else {
      collapsible.style.display = 'none'
    }
    isExpanded = !isExpanded
  })

  // Append the button and collapsible to the container
  container.appendChild(button)
  container.appendChild(collapsible)

  // Append the container to the document body
  document.body.appendChild(container)
}

// Function to show notification
window.showNotification = (message) => {
  // Check if a notification container already exists, create one if not
  let notificationContainer = document.getElementById('notification-container')
  if (!notificationContainer) {
    notificationContainer = document.createElement('div')
    notificationContainer.id = 'notification-container'
    Object.assign(notificationContainer.style, {
      position: 'fixed',
      top: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      zIndex: 9999,
    })
    document.body.appendChild(notificationContainer)
  }

  // Create a new notification element
  const notification = document.createElement('div')
  notification.className = 'notification'
  Object.assign(notification.style, {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '16px 24px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#1f2937',
    fontSize: '14px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column', // Updated for title alignment
    alignItems: 'flex-start',
    animation: 'fadeIn 0.3s ease-out',
  })

  // Add title (app name)
  const title = document.createElement('div')
  title.textContent = 'BapBi'
  Object.assign(title.style, {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#1f2937',
  })
  notification.appendChild(title)

  // Add message text
  const messageText = document.createElement('span')
  messageText.textContent = message
  messageText.style.lineHeight = '1.4'
  notification.appendChild(messageText)

  // Add close button
  const closeButton = document.createElement('button')
  closeButton.textContent = '×'
  Object.assign(closeButton.style, {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    position: 'absolute',
    top: '8px',
    right: '16px',
    cursor: 'pointer',
    color: '#4b5563',
  })
  closeButton.addEventListener('click', () => {
    notification.remove()
  })
  notification.appendChild(closeButton)

  // Append notification to container
  notificationContainer.appendChild(notification)

  // Auto-remove notification after 4 seconds
  setTimeout(() => {
    notification.remove()
  }, 4000)
}

function getHighlightMessage(totalHighlights) {
  const singleHighlightMessages = [
    'Found 1 saved highlight on this page.',
    'Here’s your saved highlight!',
    'A single highlight is waiting for you!',
    '1 highlight loaded. Ready to revisit?',
    'Your highlight is back—just as you left it!',
  ]

  const multipleHighlightMessages = [
    'Found {n} highlights on this page. Welcome back!',
    '{n} highlights are ready for you!',
    'Your saved {n} highlights are here!',
    '{n} highlights loaded. Let’s pick up where you left off!',
    '{n} highlights are back—explore and enjoy!',
  ]

  if (totalHighlights === 0) {
    return ''
  }

  if (totalHighlights === 1) {
    return singleHighlightMessages[
      Math.floor(Math.random() * singleHighlightMessages.length)
    ]
  } else {
    const message =
      multipleHighlightMessages[
        Math.floor(Math.random() * multipleHighlightMessages.length)
      ]
    return message.replace('{n}', totalHighlights)
  }
}
