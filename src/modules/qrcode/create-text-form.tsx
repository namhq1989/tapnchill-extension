import { Label } from '@/components/ui/label.tsx'
import { Textarea } from '@/components/ui/textarea.tsx' // Assuming you have a Textarea component
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import QRCodeSettings from '@/modules/qrcode/settings.tsx'
import { useCallback, useEffect, useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { renderQRCode } from '@/modules/qrcode/util.ts'
import { Input } from '@/components/ui/input.tsx'
import { QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo } from 'react-chrome-extension-router'
import QRCodeDetailView from '@/modules/qrcode/detail.tsx'

const CreateQRCodeTextForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { isBlocking, settings, createQRCode } = useQRCodeStore()

  const [name, setName] = useState('')
  const [text, setText] = useState('Your text here')

  const handleRender = useCallback(() => {
    if (!text.trim()) {
      showErrorNotification({
        description: 'Please enter some text',
      })
      return
    }
    if (text.length > 300) {
      showErrorNotification({
        description: 'Text must be less than 300 characters',
      })
      return
    }

    renderQRCode(text, settings)
  }, [text, settings, showErrorNotification])

  useEffect(() => {
    handleRender()
  }, [handleRender])

  const create = async () => {
    if (!text.trim()) {
      showErrorNotification({
        description: 'Please enter some text',
      })
      return
    }

    const { qrCode, isSuccess } = await createQRCode(
      name,
      QRCodeType.text,
      text,
      settings,
      {
        text,
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
      <div className='flex flex-col w-full p-4'>
        <div className='flex flex-col items-center justify-center my-8 gap-4 pb-4 border-b-[1px]'>
          <img id='image' alt='qr-code' className='w-[200px] mb-4' />
          <QRCodeSettings />
        </div>
        <div className='flex flex-col gap-8'>
          <h2 className='text-base font-bold tracking-wide'>
            [TEXT] QR Code Details
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
            <Label htmlFor='text'>Text</Label>
            <Textarea
              id='text'
              placeholder='Enter your text'
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (e.target.value.trim()) {
                  handleRender()
                }
              }}
              className='resize-none'
              rows={4}
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

export default CreateQRCodeTextForm
