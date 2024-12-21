import { Label } from '@/components/ui/label.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import QRCodeSettings from '@/modules/qrcode/settings.tsx'
import { useCallback, useEffect, useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { renderQRCode } from '@/modules/qrcode/util.ts'

const CreateQRCodeVCardForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { settings } = useQRCodeStore()

  // Default values
  const [firstName, setFirstName] = useState('John')
  const [lastName, setLastName] = useState('Doe')
  const [phoneNumber, setPhoneNumber] = useState('+1234567890')
  const [email, setEmail] = useState('john.doe@example.com')
  const [organization, setOrganization] = useState('Example Corp')
  const [title, setTitle] = useState('Software Engineer')

  const handleRender = useCallback(() => {
    if (!firstName.trim() || !lastName.trim()) {
      showErrorNotification({
        description: 'Please enter both first and last names',
      })
      return
    }

    // Format the vCard QR code content
    const vCardContent = `
      BEGIN:VCARD
      VERSION:3.0
      N:${lastName};${firstName};;;
      FN:${firstName} ${lastName}
      ORG:${organization}
      TITLE:${title}
      TEL:${phoneNumber}
      EMAIL:${email}
      END:VCARD
    `.trim()

    renderQRCode(vCardContent, settings)
  }, [
    firstName,
    lastName,
    phoneNumber,
    email,
    organization,
    title,
    settings,
    showErrorNotification,
  ])

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
            [VCARD] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='QR Code Name' />
          </div>

          {/* First Name and Last Name in One Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                placeholder='Enter first name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  handleRender()
                }}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                placeholder='Enter last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  handleRender()
                }}
              />
            </div>
          </div>

          {/* Phone Number and Email in One Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                type='tel'
                placeholder='Enter phone number'
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  handleRender()
                }}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  handleRender()
                }}
              />
            </div>
          </div>

          {/* Organization and Job Title in One Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='organization'>Organization</Label>
              <Input
                id='organization'
                placeholder='Enter organization'
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value)
                  handleRender()
                }}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='title'>Job Title</Label>
              <Input
                id='title'
                placeholder='Enter job title'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  handleRender()
                }}
              />
            </div>
          </div>

          <Button className='font-bold'>Create</Button>
        </div>
      </div>
    </div>
  )
}

export default CreateQRCodeVCardForm
