import { goTo } from 'react-chrome-extension-router'
import FocusUIView from '@/modules/focus/view.tsx'

const Pulse = () => {
  return (
    <div
      className='pulse'
      title='Focusing'
      onClick={() => {
        goTo(FocusUIView)
      }}
    ></div>
  )
}

export default Pulse
