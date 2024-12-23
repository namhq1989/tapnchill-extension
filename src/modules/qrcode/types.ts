import { ComponentType } from 'react'
import { SubscriptionPlan } from '@/modules/common/types.ts'

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

export interface IQRCodeDataEmail {
  to: string
  subject: string
  body: string
}

export interface IQRCodeDataSMS {
  to: string
  body: string
}

export interface IQRCodeDataLocation {
  latitude: number
  longitude: number
}

export interface IQRCodeDataCryptoCurrency {
  currency: string
  walletAddress: string
  amount: number
}

export interface IQRCodeDataVCard {
  firstName: string
  lastName: string
  email: string
  phone: string
  organization: string
  job: string
}

export interface IQRCodeData {
  url?: string
  text?: string
  email?: IQRCodeDataEmail
  sms?: IQRCodeDataSMS
  location?: IQRCodeDataLocation
  cryptocurrency?: IQRCodeDataCryptoCurrency
  vcard?: IQRCodeDataVCard
}

export interface IQRCode {
  id: string
  name: string
  type: QRCodeType
  content: string
  settings: IQRSettings
  data: IQRCodeData
  createdAt: Date
}

export interface IQRStore {
  userPlan: SubscriptionPlan
  setUserPlan: (plan: SubscriptionPlan) => void

  initQRCodes: () => Promise<void>
  settings: IQRSettings
  setSettings: (settings: IQRSettings) => void

  qrCodesHasFetched: boolean
  isFetching: boolean
  isBlocking: boolean

  qrCodes: IQRCode[]
  nextPageToken: string

  fetchQRCodes(): Promise<void>
  loadMoreQRCodes(): Promise<void>
  createQRCode(
    name: string,
    type: QRCodeType,
    content: string,
    settings: IQRSettings,
    data: IQRCodeData,
  ): Promise<{ qrCode: IQRCode | null; isSuccess: boolean }>
  updateQRCode(qrCode: IQRCode): Promise<boolean>
  deleteQRCode(qrCode: IQRCode): Promise<boolean>
}

export interface ICreateQRCodeRequest {
  name: string
  type: string
  content: string
  settings: IQRSettings
  data: IQRCodeData
}

export interface ICreateQRCodeResponse {
  id: string
}

export interface IUpdateQRCodeRequest {
  name: string
}

export interface IUpdateQRCodeResponse {
  id: string
}

export interface IGetQRCodesRequest {
  pageToken: string
}

export interface IGetQRCodesResponse {
  nextPageToken: string
  qrCodes: IQRCodeApiData[]
}

export interface IQRCodeApiData {
  id: string
  name: string
  type: string
  content: string
  settings: IQRSettings
  data: string
  createdAt: string
}
