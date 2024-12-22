import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import QRCodeSettings from '@/modules/qrcode/settings.tsx'
import { useCallback, useEffect, useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { renderQRCode } from '@/modules/qrcode/util.ts'
import { QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo } from 'react-chrome-extension-router'
import QRCodeDetailView from '@/modules/qrcode/detail.tsx'

const CreateQRCodeURLForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { isBlocking, settings, createQRCode } = useQRCodeStore()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('https://bapbi.app')

  const handleRender = useCallback(() => {
    if (!url) {
      showErrorNotification({
        description: 'Please enter a valid URL',
      })
      return
    }

    renderQRCode(url, settings)
  }, [url, settings, showErrorNotification])

  useEffect(() => {
    handleRender()
  }, [handleRender])

  const create = async () => {
    if (!url) {
      showErrorNotification({
        description: 'Please enter a valid URL',
      })
      return
    }

    const { qrCode, isSuccess } = await createQRCode(
      name,
      QRCodeType.url,
      url,
      settings,
      {
        url,
      },
    )

    if (isSuccess) {
      goTo(QRCodeDetailView, { qrCode })
    }
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Create QR Code' />
      </div>
      <div className='flex flex-col w-full p-4 gap-4'>
        <div className='flex flex-col items-center justify-center my-8 gap-4 pb-4 border-b-[1px]'>
          <img id='image' alt='qr-code' className='w-[200px] mb-4' />
          <QRCodeSettings />
        </div>
        <div className='flex flex-col gap-8'>
          <h2 className='text-base font-bold tracking-wide'>
            [URL] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='QR Code Name'
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='url'>URL</Label>
            <Input
              id='url'
              placeholder='Your URL'
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (e.target.value) {
                  handleRender()
                }
              }}
            />
          </div>
          <Button disabled={isBlocking} className='font-bold' onClick={create}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateQRCodeURLForm
