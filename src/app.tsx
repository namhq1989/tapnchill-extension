import { setState } from '@/modules/station/store.ts'
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
import useAmbiencesStore from '@/modules/ambience/store.ts'

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
})

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === 'station-is-playing') {
    setState({
      isPlaying: true,
      isSwitchingStation: false,
      startTime: new Date(),
    })
  } else if (request.type === 'station-is-stopped') {
    const { ambiences } = useAmbiencesStore.getState()
    setState({
      isPlaying: ambiences.length > 0,
    })
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
