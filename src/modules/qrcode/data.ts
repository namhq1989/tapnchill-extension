import {
  IQRStyle,
  IQRType,
  QRCodeStyle,
  QRCodeType,
} from '@/modules/qrcode/types.ts'
import {
  Coins,
  Contact,
  Link2,
  Mail,
  MapPinned,
  MessageCircleCode,
  Text,
} from 'lucide-react'

const qrTypes: IQRType[] = [
  { value: QRCodeType.url, label: 'URL', icon: Link2 },
  { value: QRCodeType.vcard, label: 'vCard', icon: Contact },
  { value: QRCodeType.text, label: 'Text', icon: Text },
  { value: QRCodeType.email, label: 'E-mail', icon: Mail },
  { value: QRCodeType.sms, label: 'SMS', icon: MessageCircleCode },
  { value: QRCodeType.location, label: 'Location', icon: MapPinned },
  { value: QRCodeType.cryptocurrency, label: 'Crypto currency', icon: Coins },
  // { value: 'wifi', label: 'Wi-Fi' },
  // { value: 'bitcoin', label: 'Bitcoin' },
  // { value: 'twitter', label: 'Twitter' },
  // { value: 'facebook', label: 'Facebook' },
  // { value: 'pdf', label: 'PDF' },
  // { value: 'mp3', label: 'MP3' },
  // { value: 'appstores', label: 'App Stores' },
  // { value: 'images', label: 'Images' },
  // { value: '2dbarcode', label: '2D Barcodes' },
]

const qrStyles: IQRStyle[] = [
  {
    value: QRCodeStyle.rounded,
    cornerValue: 'rounded',
    label: 'Rounded',
  },
  {
    value: QRCodeStyle.square,
    cornerValue: 'square',
    label: 'Square',
  },
  {
    value: QRCodeStyle.dot,
    cornerValue: 'circle',
    label: 'Dot',
  },
  {
    value: QRCodeStyle.diamond,
    cornerValue: 'circle-diamond',
    label: 'Diamond',
  },
  {
    value: QRCodeStyle.star,
    cornerValue: 'circle-star',
    label: 'Star',
  },
  {
    value: QRCodeStyle.fluidLine,
    cornerValue: 'rounded',
    label: 'Fluid',
  },
  {
    value: QRCodeStyle.stripe,
    cornerValue: 'square',
    label: 'Stripe',
  },
]

export { qrTypes, qrStyles }
