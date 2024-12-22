import { Label } from '@/components/ui/label.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import QRCodeSettings from '@/modules/qrcode/settings.tsx'
import { useCallback, useEffect, useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { renderQRCode } from '@/modules/qrcode/util.ts'
import { QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo } from 'react-chrome-extension-router'
import QRCodeDetailView from '@/modules/qrcode/detail.tsx'

const CreateQRCodeEmailForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { isBlocking, settings, createQRCode } = useQRCodeStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('hi@bapbi.app')
  const [subject, setSubject] = useState('Hello from BapBi')
  const [body, setBody] = useState(
    'Hi there,\n\nThis is a QR Code-generated email.',
  )

  const handleRender = useCallback(() => {
    if (!email.trim()) {
      showErrorNotification({
        description: 'Please enter a valid email address',
      })
      return
    }

    // Format the email QR code content
    const emailContent = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    renderQRCode(emailContent, settings)
  }, [email, subject, body, settings, showErrorNotification])

  useEffect(() => {
    handleRender()
  }, [handleRender])

  const create = async () => {
    if (!email.trim()) {
      showErrorNotification({
        description: 'Please enter a valid email address',
      })
      return
    }

    const { qrCode, isSuccess } = await createQRCode(
      name,
      QRCodeType.email,
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      settings,
      {
        email: {
          to: email,
          subject,
          body,
        },
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
            [EMAIL] QR Code Details
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
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='Enter the email address'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleRender()
              }}
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              placeholder='Enter the email subject'
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                handleRender()
              }}
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='body'>Email Body</Label>
            <Textarea
              id='body'
              placeholder='Enter the email body'
              value={body}
              onChange={(e) => {
                setBody(e.target.value)
                handleRender()
              }}
              className='resize-none'
              rows={8}
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

export default CreateQRCodeEmailForm
