export interface INotification {
  description: string
  title?: string
  duration?: number
}

export interface INotificationStore {
  showNotification: (notification: INotification) => void
  showErrorNotification: (notification: INotification) => void
}
