import { create } from 'zustand'
import {
  ICreateQRCodeRequest,
  ICreateQRCodeResponse,
  IGetQRCodesRequest,
  IGetQRCodesResponse,
  IQRCode,
  IQRCodeData,
  IQRSettings,
  IQRStore,
  IUpdateQRCodeRequest,
  IUpdateQRCodeResponse,
  QRCodeSize,
  QRCodeStyle,
  QRCodeType,
} from '@/modules/qrcode/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import { mapQRCodes } from '@/modules/qrcode/util.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { SubscriptionPlan } from '@/modules/common/types.ts'

const useQRCodeStore = create<IQRStore>((set, get) => ({
  userPlan: SubscriptionPlan.free,
  setUserPlan: (plan: SubscriptionPlan) => {
    set({ userPlan: plan })
  },

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

  isFetching: false,
  qrCodesHasFetched: false,
  isBlocking: false,
  qrCodes: [],
  nextPageToken: '',

  fetchQRCodes: async () => {
    const { qrCodesHasFetched } = get()
    if (qrCodesHasFetched) return

    set({ isBlocking: true })
    get().loadMoreQRCodes()
    set({ isBlocking: false })
  },

  loadMoreQRCodes: async () => {
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      set({ isFetching: true })

      const { get: httpGet } = useHttpStore.getState()
      const { nextPageToken } = get()
      const response = await httpGet<IGetQRCodesResponse>('api/qr-code', {
        pageToken: nextPageToken,
      } as IGetQRCodesRequest)

      const { qrCodes } = get()
      set({
        qrCodes: [...qrCodes, ...mapQRCodes(response.qrCodes)],
        nextPageToken: response.nextPageToken,
        qrCodesHasFetched: true,
        isFetching: false,
      })
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      set({ isFetching: false })
    }
  },

  createQRCode: async (
    name: string,
    type: QRCodeType,
    content: string,
    settings: IQRSettings,
    data: IQRCodeData,
  ) => {
    set({ isBlocking: true })

    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateQRCodeResponse>('api/qr-code', {
        name,
        type,
        content,
        settings,
        data: JSON.stringify(data),
      } as ICreateQRCodeRequest)

      showNotification({
        description: 'QR Code created successfully',
      })

      const newQRCode: IQRCode = {
        id: response.id,
        name,
        type,
        content,
        settings,
        data,
        createdAt: new Date(),
      }

      const { qrCodes } = get()
      qrCodes.unshift(newQRCode)
      set({ qrCodes })

      set({ isBlocking: false })
      return { qrCode: newQRCode, isSuccess: true }
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      set({ isBlocking: false })
      return { qrCode: null, isSuccess: false }
    }
  },
  updateQRCode: async (qrCode: IQRCode) => {
    set({ isBlocking: true })

    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<IUpdateQRCodeResponse>(`api/qr-code/${qrCode.id}`, {
        name: qrCode.name,
      } as IUpdateQRCodeRequest)

      showNotification({
        description: 'QR code updated successfully',
      })

      const { qrCodes } = get()
      set({
        qrCodes: qrCodes.map((q) => (q.id === qrCode.id ? qrCode : q)),
      })

      set({ isBlocking: false })
      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      set({ isBlocking: false })
      return false
    }
  },
  deleteQRCode: async (qrCode: IQRCode) => {
    set({ isBlocking: true })

    const { delete: httpDelete } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpDelete(`api/qr-code/${qrCode.id}`, {})

      showNotification({
        description: 'QR code deleted successfully',
      })

      const { qrCodes } = get()
      set({
        qrCodes: qrCodes.filter((q) => q.id !== qrCode.id),
      })

      set({ isBlocking: false })
      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      set({ isBlocking: false })
      return false
    }
  },
}))

export default useQRCodeStore
