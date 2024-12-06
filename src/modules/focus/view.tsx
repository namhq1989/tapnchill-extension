import useFocusUIStore from '@/modules/focus/ui-store.ts'
import FocusProgressingView from '@/modules/focus/progressing.tsx'
import FocusSetupView from '@/modules/focus/setup.tsx'
import { FocusView } from '@/modules/focus/types.ts'
import { useEffect } from 'react'

const FocusUIView = () => {
  const { isInitializing, initFocus, currentView } = useFocusUIStore()

  useEffect(() => {
    initFocus()
  }, [initFocus])

  if (isInitializing) {
    return null
  }

  if (currentView === FocusView.progressing) {
    return <FocusProgressingView />
  }

  return <FocusSetupView />
}

export default FocusUIView
