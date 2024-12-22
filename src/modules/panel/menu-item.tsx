import { goTo, Link } from 'react-chrome-extension-router'
import QRCodeView from '@/modules/qrcode/view.tsx'
import NoteView from '@/modules/note/view.tsx'
import { useEffect } from 'react'
import LoadingIndicator from '@/modules/common/loading-indicator.tsx'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import usePanelStore from '@/modules/panel/store.ts'

const PanelMenuItem = () => {
  const { initApp, isInitializing } = usePanelStore()
  const { initQRCodes } = useQRCodeStore()

  useEffect(() => {
    const fetch = async () => {
      await initApp()
    }

    fetch().then(() => {
      chrome.storage.local.get(['panelMenu'], async (result) => {
        await initQRCodes()
        const { panelMenu } = result

        if (panelMenu) {
          chrome.storage.local
            .set({
              panelMenu: '',
            })
            .then(() => {
              if (panelMenu === 'notes') {
                goTo(NoteView)
              } else if (panelMenu === 'qr') {
                goTo(QRCodeView)
              }
            })
        }
      })
    })
  }, [initApp, initQRCodes])

  if (isInitializing) {
    return (
      <div className='flex flex-col gap-8 w-[400px] h-[600px] scrollbar-hide justify-center items-center'>
        <img src='/icons/icon128.png' alt='logo' width={48} height={48} />
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className='grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 p-4 mt-8'>
      <Link
        component={NoteView}
        className='flex flex-col gap-4 p-4 items-center justify-center'
      >
        <img
          src='https://i.bapbi.app/notes.png'
          alt='task'
          className='w-10 h-10 bg-cover'
        />
        <p className='text-sm font-bold'>Note</p>
      </Link>
      <Link
        component={QRCodeView}
        className='flex flex-col gap-4 p-4 items-center justify-center'
      >
        <img
          src='https://i.bapbi.app/qr-code.png'
          alt='task'
          className='w-10 h-10 bg-cover'
        />
        <p className='text-sm font-bold'>QR</p>
      </Link>
    </div>
  )
}

export default PanelMenuItem
