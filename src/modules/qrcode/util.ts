import { qrStyles } from '@/modules/qrcode/data.ts'
import QrCodeWithLogo from 'qrcode-with-logos'
import { CornerType, DotType } from 'qrcode-with-logos/types/src/core/types'
import { IQRSettings } from '@/modules/qrcode/types.ts'

const renderQRCode = (content: string, settings: IQRSettings) => {
  const imageElement = document.getElementById('image')
  if (imageElement instanceof HTMLImageElement) {
    const style = qrStyles.find((style) => style.value === settings.style)

    let logo = undefined
    if (settings.hasLogo) {
      logo = {
        src: settings.logoData || '/icons/icon128.png',
      }
    }

    new QrCodeWithLogo({
      image: imageElement,
      content,
      width: settings.width,
      logo,
      dotsOptions: {
        color: settings.color,
        type: settings.style as DotType,
      },
      cornersOptions: {
        color: settings.color,
        type: style?.cornerValue as CornerType,
      },
    })
  }
}

export { renderQRCode }
