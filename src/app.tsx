import { setState } from '@/modules/station/store.ts'
import useNoteStore from '@/modules/note/store.ts'
import { useEffect } from 'react'
import {
  getComponentStack,
  getCurrent,
  Router,
} from 'react-chrome-extension-router'
import HomeView from '@/modules/common/home.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'

chrome.storage.local.get((result) => {
  if (result.selectedText) {
    useNoteStore
      .getState()
      .openCreateNoteDialog(
        result.selectedText,
        result.pageUrl,
        result.pageTitle,
      )
    chrome.storage.local
      .set({
        selectedText: '',
        pageUrl: '',
        pageTitle: '',
      })
      .then()
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'station-is-playing') {
    setState({
      isPlaying: true,
      isSwitchingStation: false,
      startTime: new Date(),
    })
  } else if (request.type === 'station-is-stopped') {
    setState({
      isPlaying: false,
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
