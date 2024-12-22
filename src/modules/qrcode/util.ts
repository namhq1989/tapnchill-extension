import { qrStyles } from '@/modules/qrcode/data.ts'
import QrCodeWithLogo from 'qrcode-with-logos'
import { CornerType, DotType } from 'qrcode-with-logos/types/src/core/types'
import {
  IQRCode,
  IQRCodeApiData,
  IQRSettings,
  QRCodeType,
} from '@/modules/qrcode/types.ts'

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
      nodeQrCodeOptions: {
        errorCorrectionLevel: 'Q',
      },
    })
  }
}

const downloadQRCode = (
  qrCode: IQRCode,
  settings: IQRSettings,
  width: number,
  callback?: () => void,
) => {
  const style = qrStyles.find((style) => style.value === settings.style)

  let logo = undefined
  if (settings.hasLogo) {
    logo = {
      src: settings.logoData || '/icons/icon128.png',
    }
  }

  const qr = new QrCodeWithLogo({
    content: qrCode.content,
    width,
    logo,
    dotsOptions: {
      color: settings.color,
      type: settings.style as DotType,
    },
    cornersOptions: {
      color: settings.color,
      type: style?.cornerValue as CornerType,
    },
    nodeQrCodeOptions: {
      errorCorrectionLevel: 'Q',
    },
  })

  qr.downloadImage(`${qrCode.name}_${width}.png`).then(() => {
    callback?.()
  })
}

const mapQRCode = (qrCode: IQRCodeApiData): IQRCode => {
  return {
    id: qrCode.id,
    name: qrCode.name,
    type: qrCode.type as QRCodeType,
    content: qrCode.content,
    settings: qrCode.settings,
    data: JSON.parse(qrCode.data),
    createdAt: new Date(qrCode.createdAt),
  }
}

const mapQRCodes = (qrCodes: IQRCodeApiData[]): IQRCode[] => {
  const result: IQRCode[] = []
  for (const qrCode of qrCodes) {
    result.push(mapQRCode(qrCode))
  }
  return result
}

export { renderQRCode, downloadQRCode, mapQRCode, mapQRCodes }
