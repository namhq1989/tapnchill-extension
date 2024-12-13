import useFocusUIStore from '@/modules/focus/ui-store.ts'
import FocusProgressingView from '@/modules/focus/progressing.tsx'
import FocusSetupView from '@/modules/focus/setup.tsx'
import { FocusStatus, FocusView } from '@/modules/focus/types.ts'
import { useEffect } from 'react'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'
import FocusCompletedView from '@/modules/focus/completed.tsx'

const FocusUIView = () => {
  const { isInitializing, initFocus, currentView } = useFocusUIStore()
  const { status } = useFocusProgressingStore()

  useEffect(() => {
    initFocus()
  }, [initFocus])

  if (isInitializing) {
    return null
  }

  if (currentView === FocusView.progressing) {
    if (status === FocusStatus.completed) {
      return <FocusCompletedView />
    }
    return <FocusProgressingView />
  }

  return <FocusSetupView />
}

export default FocusUIView
