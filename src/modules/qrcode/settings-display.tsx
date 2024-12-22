import { qrStyles } from '@/modules/qrcode/data.ts'
import { IQRSettings } from '@/modules/qrcode/types.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'

export interface IQRCodeSettingsDisplayProps {
  settings: IQRSettings
}

const QRCodeSettingsDisplay = (props: IQRCodeSettingsDisplayProps) => {
  const { settings } = props

  const style = qrStyles.find((s) => s.value === settings.style)

  return (
    <div className='flex flex-col w-full items-center justify-center my-4 gap-4'>
      <div className='flex flex-row w-full gap-4 items-center justify-between'>
        <p className='text-base'>Color</p>
        <p className='text-base font-bold'>{settings.color}</p>
      </div>
      <div className='flex flex-row w-full gap-4 items-center justify-between'>
        <p className='text-base'>Has logo</p>
        <Checkbox checked={settings.hasLogo} />
      </div>
      {settings.hasLogo && (
        <div className='flex flex-row w-full gap-4 items-center justify-between'>
          <p className='text-base'>Logo</p>
          <p className='text-base font-bold'>
            {settings.logoName || 'bapbi-icon.png'}
          </p>
        </div>
      )}
      <div className='flex flex-row w-full items-center justify-between'>
        <p className='text-sm'>Style</p>
        <p className='text-base font-bold'>{style?.label}</p>
      </div>
    </div>
  )
}

export default QRCodeSettingsDisplay
