import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/stylesheet/global.css'
import '@/assets/stylesheet/wave-form.css'
import '@/assets/stylesheet/pulse.css'
import App from '@/app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
