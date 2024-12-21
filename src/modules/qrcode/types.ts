import { ComponentType } from 'react'

export interface IQRType {
  value: QRCodeType
  label: string
  icon: ComponentType
}

export interface IQRStyle {
  value: QRCodeStyle
  cornerValue: string
  label: string
}

export enum QRCodeType {
  url = 'url',
  vcard = 'vcard',
  text = 'text',
  email = 'email',
  sms = 'sms',
  location = 'location',
  cryptocurrency = 'cryptocurrency',
}

export enum QRCodeStyle {
  rounded = 'rounded',
  square = 'square',
  dot = 'dot',
  diamond = 'diamond',
  star = 'star',
  fluidLine = 'fluid-line',
  stripe = 'stripe',
}

export enum QRCodeSize {
  small = 100,
  medium = 256,
  large = 512,
  xlarge = 1024,
  xxlarge = 2048,
}

export interface IQRSettings {
  color: string
  hasLogo: boolean
  logoData: string
  logoName: string
  style: QRCodeStyle
  width: QRCodeSize
}

export interface IQRStore {
  initQRCodes: () => Promise<void>
  settings: IQRSettings
  setSettings: (settings: IQRSettings) => void
}
