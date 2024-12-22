import ColorPicker from '@/components/ui/color-picker.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { qrStyles } from '@/modules/qrcode/data.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { QRCodeStyle } from '@/modules/qrcode/types.ts'
import { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox.tsx'

const QRCodeSettings = () => {
  const { settings, setSettings } = useQRCodeStore()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSettings({
          ...settings,
          logoName: file.name,
          logoData: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex flex-col w-full items-center justify-center my-4 gap-4'>
      <div className='flex flex-row w-full gap-4 items-center justify-between'>
        <p className='text-base'>Color</p>
        <ColorPicker
          background={settings.color}
          setBackground={(value) => {
            setSettings({ ...settings, color: value })
          }}
          className='w-[200px]'
        />
      </div>
      <div className='flex flex-row w-full gap-4 items-center justify-between'>
        <p className='text-base'>Has logo</p>
        <Checkbox
          checked={settings.hasLogo}
          onCheckedChange={(value) => {
            setSettings({ ...settings, hasLogo: value as boolean })
          }}
        />
      </div>
      {settings.hasLogo && (
        <>
          {settings.logoData ? (
            <div className='flex flex-row w-full gap-4 items-center justify-between'>
              <p className='text-base'>Logo</p>
              <div className='flex flex-row w-[200px] items-center justify-between gap-2'>
                <div className='flex flex-grow text-sm justify-end'>
                  {settings.logoName}
                </div>
                <div
                  className='w-5 h-5 cursor-pointer'
                  onClick={() => {
                    setSettings({ ...settings, logoName: '', logoData: '' })
                  }}
                >
                  <X size={20} strokeWidth={1} />
                </div>
              </div>
            </div>
          ) : (
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
                <label htmlFor='fileInput' className='cursor-pointer'>
                  <Button
                    variant='outline'
                    className='w-[200px] cursor-pointer'
                  >
                    Upload Logo
                  </Button>
                </label>
              </div>
            </div>
          )}
        </>
      )}
      <div className='flex flex-row w-full items-center justify-between'>
        <p className='text-sm'>Select Style</p>
        <Select
          onValueChange={(value) => {
            setSettings({ ...settings, style: value as QRCodeStyle })
          }}
          defaultValue={settings.style}
        >
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Select a style' />
          </SelectTrigger>
          <SelectContent>
            {qrStyles.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default QRCodeSettings
