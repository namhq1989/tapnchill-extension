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

const CreateQRCodeSMSForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { settings } = useQRCodeStore()

  // Default values
  const [phoneNumber, setPhoneNumber] = useState('111-111-111')
  const [message, setMessage] = useState(
    'Hi there, this is a QR Code-generated SMS.',
  )

  const handleRender = useCallback(() => {
    if (!phoneNumber.trim()) {
      showErrorNotification({
        description: 'Please enter a valid phone number',
      })
      return
    }

    // Format the SMS QR code content
    const smsContent = `SMSTO:${phoneNumber}:${message}`
    renderQRCode(smsContent, settings)
  }, [phoneNumber, message, settings, showErrorNotification])

  useEffect(() => {
    handleRender()
  }, [handleRender])

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
            [SMS] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='QR Code Name' />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              type='tel'
              placeholder='Enter the phone number'
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                handleRender()
              }}
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              placeholder='Enter the SMS message'
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                handleRender()
              }}
              className='resize-none'
              rows={4}
            />
          </div>
          <Button className='font-bold'>Create</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateQRCodeSMSForm
