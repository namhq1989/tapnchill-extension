import { IPanelStore } from '@/modules/panel/types.ts'
import { create } from 'zustand'
import useHttpStore from '@/modules/http/store.ts'

const usePanelStore = create<IPanelStore>((set) => ({
  isInitializing: false,
  initApp: async () => {
    set({ isInitializing: true })
    chrome.storage.local.get(async (result) => {
      const accessToken: string = result.accessToken || ''
      const { setAccessToken } = useHttpStore.getState()
      setAccessToken(accessToken)
      set({ isInitializing: false })
    })
  },
}))

export default usePanelStore
