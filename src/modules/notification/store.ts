import { create } from 'zustand'
import { toast } from '@/hooks/use-toast'
import {
  INotification,
  INotificationStore,
} from '@/modules/notification/types.ts'

const useNotificationStore = create<INotificationStore>(() => ({
  showNotification: (notification: INotification) => {
    toast({
      title: notification.title ?? 'Tap & Chill',
      description: notification.description,
      duration: notification.duration || 3000,
    })
  },
  showErrorNotification: (notification: INotification) => {
    toast({
      title: notification.title ?? 'Tap & Chill',
      description: notification.description,
      duration: notification.duration || 5000,
      variant: 'destructive',
    })
  },
}))

export default useNotificationStore
