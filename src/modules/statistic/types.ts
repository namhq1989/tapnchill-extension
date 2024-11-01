export interface IStatisticListeningTrackingTimeItem {
  date: string
  seconds: number
  minutes: number
}

export interface IStatisticStore {
  listeningTrackingTime: IStatisticListeningTrackingTimeItem[]
  fetchListeningTrackingTime: () => void
}
