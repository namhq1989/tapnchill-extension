import { IPanelStore } from '@/modules/panel/types.ts'
import { create } from 'zustand'
import useHttpStore from '@/modules/http/store.ts'
import { SubscriptionPlan } from '@/modules/common/types.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'

const usePanelStore = create<IPanelStore>((set) => ({
  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })
    chrome.storage.local.get(async (result) => {
      const accessToken: string = result.accessToken || ''
      const { setAccessToken } = useHttpStore.getState()
      setAccessToken(accessToken)

      const userPlan: SubscriptionPlan =
        result.userPlan || SubscriptionPlan.free
      const { setUserPlan } = useQRCodeStore.getState()
      setUserPlan(userPlan)

      set({ isInitializing: false })
    })
  },
}))

export default usePanelStore
