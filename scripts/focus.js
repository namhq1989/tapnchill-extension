import { createOffscreen } from './create-offscreen.js'

const FocusStatus = Object.freeze({
  running: 'running',
  resting: 'resting',
  paused: 'paused',
  completed: 'completed',
})

/**
 * Retrieves the setup state from Chrome's local storage.
 * @param {function} callback - A function to handle the retrieved state.
 * @callback callback
 * @param {{
 *   focusTime: number,
 *   breakTime: number,
 *   numOfCycles: number,
 *   isPlaySoundOnResting: boolean,
 * } | null} state - The retrieved setup state or null if not found.
 */
const getSessionSettings = (callback) => {
  chrome.storage.local.get(['focusSessionSettings'], (result) => {
    callback(result.focusSessionSettings || null)
  })
}

/**
 * Retrieves the progress state from Chrome's local storage.
 * @param {function} callback - A function to handle the retrieved state.
 * @callback callback
 * @param {{
 *   focusSeconds: number,
 *   breakSeconds: number,
 *   numOfCycles: number,
 *   currentCountdownSeconds: number,
 *   currentCycleCount: number,
 *   status: string,
 * } | null} state - The retrieved progress state or null if not found.
 */
const getProgressStateFromStorage = (callback) => {
  chrome.storage.local.get(['focusProgress'], (result) => {
    callback(result.focusProgress || null)
  })
}

/**
 * Persists the progress state to Chrome's local storage.
 * @param {{
 *   focusSeconds: number,
 *   breakSeconds: number,
 *   numOfCycles: number,
 *   currentCountdownSeconds: number,
 *   currentCycleCount: number,
 *   status: string,
 * } | null} state - The state to persist.
 * @param {function} [cb] - Optional callback to execute after persisting.
 */
const persistProgressState = (state, cb) => {
  if (state) {
    state.lastUpdated = Date.now()
  }
  chrome.storage.local.set({ focusProgress: state }, () => {
    if (cb) {
      cb()
    }
  })
}

/**
 * Starts a new session with the given parameters.
 * @param {number} focusSeconds - Duration of the focus phase in seconds.
 * @param {number} breakSeconds - Duration of the break phase in seconds.
 * @param {number} numOfCycles - Number of cycles for the session.
 * @returns {void}
 */
const startSession = (focusSeconds, breakSeconds, numOfCycles) => {
  persistProgressState(
    {
      focusSeconds,
      breakSeconds,
      numOfCycles,
      currentCountdownSeconds: focusSeconds,
      currentCycleCount: 0,
      status: FocusStatus.running,
    },
    () => {
      chrome.alarms
        .create('focusCountdown', {
          delayInMinutes: focusSeconds / 60,
        })
        .then(() => {
          console.log(
            `Focus session alarm set for ${focusSeconds / 60} minutes.`,
          )
        })

      setRunning()
    },
  )

  chrome.storage.local.set({ focusCurrentView: 'progressing' }, () => {
    console.log('Persisted current view to storage:', 'progressing')
  })
}

const setRunning = () => {
  getProgressStateFromStorage((savedState) => {
    if (savedState) {
      const { focusSeconds, currentCycleCount } = savedState
      const focusTime = focusSeconds / 60

      persistProgressState({
        ...savedState,
        currentCountdownSeconds: focusSeconds,
        status: FocusStatus.running,
      })

      chrome.alarms
        .create('focusCountdown', {
          delayInMinutes: focusTime,
        })
        .then(() => {
          chrome.runtime
            .sendMessage({
              type: 'focus-phase-updating',
              data: {
                countdownSeconds: focusSeconds - 1,
                currentCountdownSeconds: focusSeconds - 1,
                status: FocusStatus.running,
                currentCycleCount,
              },
            })
            .then(() => {
              console.log(
                `[background] message 'focus-phase-updating' status RUNNING sent`,
              )
            })

          createOffscreen()
            .then(() => {
              chrome.runtime
                .sendMessage({ type: 'offscreen-play-focusing-phase-sound' })
                .then()
            })
            .catch((error) => {
              console.error('Failed to create offscreen document:', error)
            })

          console.log(`Running time alarm set for ${focusTime} minutes`)
        })

      const { title, message } = getRandomRunningPhaseNotification()
      chrome.notifications
        .create({
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title,
          message,
          priority: 2,
        })
        .then()
    }
  })
}

const setResting = () => {
  getProgressStateFromStorage((savedState) => {
    if (savedState) {
      const { breakSeconds, currentCycleCount } = savedState
      const breakTime = breakSeconds / 60

      persistProgressState({
        ...savedState,
        currentCountdownSeconds: breakSeconds,
        status: FocusStatus.resting,
      })

      chrome.alarms
        .create('breakCountdown', {
          delayInMinutes: breakTime,
        })
        .then(() => {
          chrome.runtime
            .sendMessage({
              type: 'focus-phase-updating',
              data: {
                countdownSeconds: breakSeconds - 1,
                currentCountdownSeconds: breakSeconds - 1,
                status: FocusStatus.resting,
                currentCycleCount,
              },
            })
            .then(() => {
              console.log(
                `[background] message 'focus-phase-updating' status RESTING sent`,
              )
            })

          getSessionSettings((settings) => {
            if (settings && settings.isPlaySoundOnResting) {
              createOffscreen()
                .then(() => {
                  chrome.runtime
                    .sendMessage({ type: 'offscreen-play-resting-phase-sound' })
                    .then()
                })
                .catch((error) => {
                  console.error('Failed to create offscreen document:', error)
                })
            }
          })

          console.log(`Break time alarm set for ${breakTime} minutes`)
        })

      const { title, message } = getRandomRestingPhaseNotification()
      chrome.notifications
        .create({
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title,
          message,
          priority: 2,
        })
        .then()
    }
  })
}

const setCompleted = () => {
  getProgressStateFromStorage((savedState) => {
    if (savedState) {
      persistProgressState({
        ...savedState,
        currentCountdownSeconds: 0,
        status: FocusStatus.completed,
      })

      chrome.runtime
        .sendMessage({
          type: 'focus-phase-updating',
          data: {
            status: FocusStatus.completed,
          },
        })
        .then(() => {
          console.log(
            `[background] message 'focus-phase-updating' status COMPLETED sent`,
          )
        })

      console.log('send COMPLETED notification')

      const { title, message } = getRandomFocusSessionEndedNotification()
      chrome.notifications
        .create({
          type: 'basic',
          iconUrl: '/icons/icon128.png',
          title,
          message,
          priority: 2,
        })
        .then()
    }
  })
}

const stopSession = () => {
  chrome.alarms.clear('focusCountdown', () => {
    console.log('Focus countdown alarm cleared on reset')
  })

  chrome.alarms.clear('breakCountdown', () => {
    console.log('Break countdown alarm cleared on reset')
  })

  persistProgressState(null)

  chrome.storage.local.set({ focusCurrentView: 'setup' }, () => {
    console.log('Persisted current view to storage:', 'setup')
  })
}

let blockedSites = []

const isBlockingEnabled = async () => {
  const { focusProgress } = await chrome.storage.local.get('focusProgress')
  if (!focusProgress) return false

  const status = focusProgress && focusProgress.status
  if (!status || status !== FocusStatus.running) {
    return false
  }

  const { blockedSites: sites } = await chrome.storage.local.get('blockedSites')
  blockedSites = sites || []
  return true
}

const isBlockedDomain = (url) => {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname // Extract the hostname (e.g., "facebook.com")

    return blockedSites.some(
      (domain) =>
        hostname === domain.hostname ||
        hostname.endsWith(`.${domain.hostname}`),
    )
  } catch (error) {
    console.error('Invalid URL:', url)
    return false // If the URL can't be parsed, assume it's not blocked
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const blockingEnabled = await isBlockingEnabled()
  if (!blockingEnabled) return

  const currentUrl = tab.url
  if (currentUrl && isBlockedDomain(currentUrl)) {
    const redirectUrl = `/blocked.html?site=${new URL(currentUrl).hostname.replace('www.', '')}`
    chrome.tabs
      .update(tabId, { url: chrome.runtime.getURL(redirectUrl) })
      .then()
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'focusCountdown') {
    // console.log('Focusing phase completed!')

    getProgressStateFromStorage((savedState) => {
      const currentCycleCount = savedState.currentCycleCount || 0
      const numOfCycles = savedState.numOfCycles || 0

      // console.log(
      //   `---- focusCountdown currentCycle: ${currentCycleCount}, numOfCycles: ${numOfCycles}`,
      // )

      if (currentCycleCount < numOfCycles) {
        setResting()
      } else {
        // console.log('---- enough cycles, session completed')
        setCompleted()
      }
    })
  } else if (alarm.name === 'breakCountdown') {
    // console.log('Resting phase completed!')

    getProgressStateFromStorage((savedState) => {
      const currentCycleCount = savedState.currentCycleCount || 0
      const numOfCycles = savedState.numOfCycles || 0

      // console.log(
      //   `---- breakCountdown currentCycle: ${currentCycleCount}, numOfCycles: ${numOfCycles}`,
      // )

      if (currentCycleCount < numOfCycles - 1) {
        persistProgressState(
          {
            ...savedState,
            currentCycleCount: currentCycleCount + 1,
          },
          () => {
            setRunning()
          },
        )
      } else {
        // console.log('---- enough cycles, session completed')
        setCompleted()
      }
    })
  }
})

const focusSessionEndedNotificationOptions = [
  {
    title: 'Focus Achieved!',
    message: "🎉 Way to go! You've completed your focus session.",
  },
  {
    title: "Time's Up!",
    message: '⏰ Take a break or start another productive session.',
  },
  { title: 'Session Complete', message: "🎯 You've nailed it! What's next?" },
  {
    title: 'Great Job!',
    message: '👏 Your focus session is done. Keep up the momentum!',
  },
  {
    title: 'Break Time!',
    message: "☕ You've earned this! Relax or dive into the next task.",
  },
  {
    title: 'Well Done!',
    message: '👍 You’ve finished strong! Ready for another round?',
  },
  {
    title: 'Amazing Effort!',
    message: '💪 Another session in the books. Celebrate your progress!',
  },
  {
    title: 'Keep It Going!',
    message: '🚀 Your focus session ended. Let’s plan the next step!',
  },
  {
    title: 'Mission Accomplished',
    message: '🏆 Great work! One step closer to your goals.',
  },
  {
    title: 'Focus Mastered',
    message: '🎓 You’ve completed your session like a pro!',
  },
  {
    title: 'Boom! Session Done!',
    message: "💥 Crushed it! What's next on your list?",
  },
  {
    title: 'Beep Beep',
    message: '🚗 Focus session complete! Take off to your next task!',
  },
  {
    title: 'You Rocked It!',
    message: '🤘 That was awesome! Ready for round two?',
  },
  {
    title: 'Time Well Spent!',
    message: '⏳ Focus session done. You’re unstoppable!',
  },
  {
    title: 'Ding! Focus Complete!',
    message: '🔔 Nice job! What’s your next move?',
  },
  {
    title: 'Take a Deep Breath',
    message: '😌 Your focus session is done. Enjoy a well-earned break.',
  },
  {
    title: 'Peaceful Progress',
    message: '🌱 You’ve completed a session. Reflect and recharge.',
  },
  {
    title: 'A Step Forward',
    message: '📈 Focus achieved. Keep moving toward your goals.',
  },
  {
    title: 'Time to Unwind',
    message: '🛋️ Session done. Take some time for yourself.',
  },
  {
    title: 'Pause and Reset',
    message: '🔄 You’ve finished this session. What’s next?',
  },
]

const getRandomFocusSessionEndedNotification = () => {
  const randomIndex = Math.floor(
    Math.random() * focusSessionEndedNotificationOptions.length,
  )
  return focusSessionEndedNotificationOptions[randomIndex]
}

const runningPhaseNotificationOptions = [
  {
    title: 'Stay Focused! 🚀',
    message:
      'Your focus session has started. Stay on track and avoid distractions!',
  },
  {
    title: 'Focus Time Started 🕒',
    message: 'You’re in Focus Mode. Make every second count!',
  },
  {
    title: 'Let’s Get to Work! 💪',
    message: 'Focus Time: Work deeply and make progress towards your goals!',
  },
  {
    title: 'In the Zone 🔥',
    message: 'Time to concentrate and achieve your best work!',
  },
  {
    title: 'Deep Work Ahead 📘',
    message: 'Eliminate distractions and dive into your tasks with full focus.',
  },
]

const getRandomRunningPhaseNotification = () => {
  const randomIndex = Math.floor(
    Math.random() * runningPhaseNotificationOptions.length,
  )
  return runningPhaseNotificationOptions[randomIndex]
}

const restingPhaseNotificationOptions = [
  {
    title: 'Take a Break! 🌿',
    message: 'Relax and recharge—you’ve earned it!',
  },
  {
    title: 'Break Time! ☕',
    message: 'Step away and refresh your mind before the next session.',
  },
  {
    title: 'Time to Rest! ✨',
    message: 'Enjoy your break and get ready for the next focus session.',
  },
  {
    title: 'Relax and Recover 🌈',
    message: 'Breathe deeply, stretch, or enjoy a cup of tea!',
  },
  {
    title: 'Pause for a Moment 🛑',
    message: 'Take this time to unwind and clear your mind.',
  },
]

const getRandomRestingPhaseNotification = () => {
  const randomIndex = Math.floor(
    Math.random() * restingPhaseNotificationOptions.length,
  )
  return restingPhaseNotificationOptions[randomIndex]
}

export { startSession, stopSession }
