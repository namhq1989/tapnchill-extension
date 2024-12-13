import { useEffect } from 'react'
import {
  getComponentStack,
  getCurrent,
  Router,
} from 'react-chrome-extension-router'
import HomeView from '@/modules/common/home.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import useNotificationStore from '@/modules/notification/store.ts'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'
import { FocusStatus } from '@/modules/focus/types.ts'
import useStationsStore from '@/modules/station/store.ts'

chrome.storage.local.get((result) => {
  if (result.isSignedInSuccessfully) {
    useNotificationStore.getState().showNotification({
      description: 'Signed in successfully',
    })
    chrome.storage.local
      .set({
        isSignedInSuccessfully: false,
      })
      .then()
  }

  if (result.focusProgress) {
    const { status } = result.focusProgress

    useFocusProgressingStore.setState({
      status,
    })
  }
})

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === 'station-is-playing') {
    const { setState } = useStationsStore

    setState({
      isPlaying: true,
      isSwitchingStation: false,
      startTime: new Date(),
    })
  } else if (request.type === 'station-is-stopped') {
    const { setState } = useStationsStore

    setState({
      isPlaying: false,
    })
  } else if (request.type === 'focus-phase-updating') {
    const {
      data: {
        countdownSeconds,
        currentCountdownSeconds,
        status,
        currentCycleCount,
      },
    } = request
    const { setRunning, setResting, setCompleted } =
      useFocusProgressingStore.getState()

    if (status === FocusStatus.running) {
      setRunning(countdownSeconds, currentCountdownSeconds, currentCycleCount)
    } else if (status === FocusStatus.resting) {
      setResting(countdownSeconds, currentCountdownSeconds, currentCycleCount)
    } else if (status === FocusStatus.completed) {
      setCompleted()
    }
  }
})

const App = () => {
  useEffect(() => {
    const { component, props } = getCurrent()
    console.log(
      component
        ? `There is a component on the stack! ${component} with ${props}`
        : `The current stack is empty so Router's direct children will be rendered`,
    )
    const components = getComponentStack()
    console.log(`The stack has ${components.length} components on the stack`)
  })
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <Router>
        <HomeView />
      </Router>
    </ThemeProvider>
  )
}

export default App
