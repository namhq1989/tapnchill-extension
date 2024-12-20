import { ChangeEvent, useEffect, useState } from 'react'
import QrCodeWithLogo from 'qrcode-with-logos'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button.tsx'
import QRCodeURLForm from '@/modules/qrcode/url-form'
import ColorPicker from '@/components/ui/color-picker.tsx'
import useNotificationStore from '@/modules/notification/store.ts'
import { CornerType, DotType } from 'qrcode-with-logos/types/src/core/types'
import { Input } from '@/components/ui/input.tsx'

const types = [
  { value: 'url', label: 'URL' },
  { value: 'vcard', label: 'vCard' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'E-mail' },
  { value: 'sms', label: 'SMS' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'pdf', label: 'PDF' },
  { value: 'mp3', label: 'MP3' },
  { value: 'appstores', label: 'App Stores' },
  { value: 'images', label: 'Images' },
  { value: '2dbarcode', label: '2D Barcodes' },
]

const styles = [
  {
    value: 'rounded',
    cornerValue: 'rounded',
    label: 'Rounded',
  },
  {
    value: 'square',
    cornerValue: 'square',
    label: 'Square',
  },
  {
    value: 'dot',
    cornerValue: 'circle',
    label: 'Dot',
  },
  {
    value: 'diamond',
    cornerValue: 'circle-diamond',
    label: 'Diamond',
  },
  {
    value: 'star',
    cornerValue: 'circle-star',
    label: 'Star',
  },
  {
    value: 'fluid-line',
    cornerValue: 'rounded',
    label: 'Fluid',
  },
  {
    value: 'stripe',
    cornerValue: 'square',
    label: 'Stripe',
  },
]

const QRCodeView = () => {
  const { showErrorNotification } = useNotificationStore()

  const [logo, setLogo] = useState<string | null>(null)
  const [color, setColor] = useState('#000000')
  const [selectedType, setSelectedType] = useState<string>('url')
  const [selectedStyle, setSelectedStyle] = useState<string>('rounded')
  const [url, setUrl] = useState<string>('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string) // Base64 URL of the selected file
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRender = () => {
    if (selectedType === 'url' && !url) {
      showErrorNotification({
        description: 'Please enter a valid URL',
      })
      return
    }

    const imageElement = document.getElementById('image')
    if (imageElement instanceof HTMLImageElement && url) {
      const style = styles.find((style) => style.value === selectedStyle)

      new QrCodeWithLogo({
        image: imageElement,
        content: url,
        width: 200,
        logo: {
          src: logo || '/icons/icon128.png',
        },
        dotsOptions: {
          color,
          type: style?.value as DotType,
        },
        cornersOptions: {
          color,
          type: style?.cornerValue as CornerType,
        },
      })
    }
  }

  useEffect(() => {
    const imageElement = document.getElementById('image')
    if (imageElement instanceof HTMLImageElement) {
      new QrCodeWithLogo({
        image: imageElement,
        content: 'https://bapbi.app',
        width: 200,
        logo: {
          src: '/icons/icon128.png',
        },
      })
    }
  }, [])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='QR Code' />
      </div>
      <div className='flex flex-col w-full p-4 gap-4'>
        <div className='flex flex-col items-center justify-center my-8 gap-4 pb-4 border-b-[1px]'>
          <img id='image' alt='qr-code' className='w-[200px] mb-4' />
          <div className='flex flex-row w-full gap-4 items-center justify-between'>
            <p className='text-base'>Color</p>
            <ColorPicker
              background={color}
              setBackground={setColor}
              className='w-[200px]'
            />
          </div>
          <div className='flex flex-row w-full gap-4 items-center justify-between'>
            <p className='text-base'>Logo</p>
            <div className='relative'>
              <Input
                id='fileInput'
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              <label
                htmlFor='fileInput'
                className='w-[200px] inline-block px-4 py-2 text-sm border-[1px] rounded-xl bg-transparent cursor-pointer'
              >
                Upload Logo
              </label>
            </div>
          </div>
          <div className='flex flex-row w-full items-center justify-between'>
            <p className='text-sm'>Select Style</p>
            <Select
              onValueChange={setSelectedStyle}
              defaultValue={selectedStyle}
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select a style' />
              </SelectTrigger>
              <SelectContent>
                {styles.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-row w-full items-center justify-between'>
            <p className='text-sm'>Select Type</p>
            <Select onValueChange={setSelectedType} defaultValue={selectedType}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select a type' />
              </SelectTrigger>
              <SelectContent className='h-[300px]'>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className='w-full font-bold' onClick={handleRender}>
            Render
          </Button>
        </div>
        {selectedType === 'url' && <QRCodeURLForm url={url} setUrl={setUrl} />}
      </div>
    </div>
  )
}

export default QRCodeView
