import { create } from 'zustand'
import {
  IQRSettings,
  IQRStore,
  QRCodeSize,
  QRCodeStyle,
} from '@/modules/qrcode/types.ts'

const useQRCodeStore = create<IQRStore>((set) => ({
  initQRCodes: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['qrcodeSettings'], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError) // Handle errors from Chrome storage
        }
        if (result.qrcodeSettings) {
          set({ settings: result.qrcodeSettings })
        }
        resolve()
      })
    })
  },
  settings: {
    color: '#000000',
    hasLogo: false,
    logoData: '',
    logoName: '',
    style: QRCodeStyle.square,
    width: QRCodeSize.medium,
  },
  setSettings: (settings: IQRSettings) => {
    chrome.storage.local
      .set({
        qrcodeSettings: settings,
      })
      .then(() => {
        set({ settings })
      })
  },
}))

export default useQRCodeStore
