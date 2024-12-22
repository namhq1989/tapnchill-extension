import { createRoot } from 'react-dom/client'
import '@/assets/stylesheet/global.css'
import '@/assets/stylesheet/wave-form.css'
import { Toaster } from '@/components/ui/toaster.tsx'
import { ThemeProvider } from '@/components/theme/theme-provider.tsx'
import { Router } from 'react-chrome-extension-router'
import PanelMenuItem from '@/modules/panel/menu-item.tsx'

function init() {
  const rootContainer = document.querySelector('#__root')
  if (!rootContainer) throw new Error("Can't find Panel root element")

  const root = createRoot(rootContainer)
  root.render(
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Toaster />
      <Router>
        <PanelMenuItem />
      </Router>
    </ThemeProvider>,
  )
}

init()
