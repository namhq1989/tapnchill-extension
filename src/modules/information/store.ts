import { create } from 'zustand'
import {
  IFeedbackFormData,
  IInformationStore,
  ISendFeedbackApiResponse,
} from '@/modules/information/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const useInformationStore = create<IInformationStore>((set) => ({
  isFeedbackSending: false,
  sendFeedback: async (data: IFeedbackFormData) => {
    set({ isFeedbackSending: true })
    const { post: httpPost } = useHttpStore.getState()
    try {
      await httpPost<ISendFeedbackApiResponse>('api/common/feedback', data)
      set({ isFeedbackSending: false })
      const { showNotification } = useNotificationStore.getState()
      showNotification({
        description: 'The feedback has been sent! Thank you for your input!',
      })
      return true
    } catch (error) {
      const { showErrorNotification } = useNotificationStore.getState()
      showErrorNotification({
        description: `Something went wrong. Please try again (${error})`,
      })
      set({ isFeedbackSending: false })
      return false
    }
  },
}))

export default useInformationStore
