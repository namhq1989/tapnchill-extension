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

const CreateQRCodeLocationForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { settings } = useQRCodeStore()

  // Default values
  const [latitude, setLatitude] = useState('51.510357')
  const [longitude, setLongitude] = useState('-0.116773')

  const handleRender = useCallback(() => {
    if (!latitude.trim() || !longitude.trim()) {
      showErrorNotification({
        description: 'Please enter both latitude and longitude',
      })
      return
    }

    // Format the Geo Location QR code content
    const geoContent = `geo:${latitude},${longitude}`
    renderQRCode(geoContent.trim(), settings)
  }, [latitude, longitude, settings, showErrorNotification])

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
            [Location] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='QR Code Name' />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='latitude'>Latitude</Label>
              <Input
                id='latitude'
                placeholder='Enter latitude'
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value)
                  handleRender()
                }}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='longitude'>Longitude</Label>
              <Input
                id='longitude'
                placeholder='Enter longitude'
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value)
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

export default CreateQRCodeLocationForm
