import { useEffect } from 'react'
import { create } from 'zustand'

interface TimerState {
  startTime: Date | null
  elapsedTime: number
  setStartTime: (time: Date) => void
  calculateElapsedTime: () => void
  reset: () => void
}

const useTimerStore = create<TimerState>((set, get) => {
  let timerInterval: NodeJS.Timeout | null = null

  return {
    startTime: null,
    elapsedTime: 0,
    setStartTime: (time: Date) => {
      set({ startTime: time, elapsedTime: 0 })
      if (timerInterval) clearInterval(timerInterval)
      timerInterval = setInterval(get().calculateElapsedTime, 1000)
    },
    calculateElapsedTime: () => {
      const startTime = get().startTime
      if (startTime) {
        const now = new Date()
        const difference = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000,
        )
        set({ elapsedTime: difference })
      }
    },
    reset: () => {
      if (timerInterval) clearInterval(timerInterval)
      set({ startTime: null, elapsedTime: 0 })
    },
  }
})

export interface IStationTimerProps {
  startTime: Date
}

const Timer = (props: IStationTimerProps) => {
  const { startTime } = props
  const { elapsedTime, setStartTime, reset } = useTimerStore()

  useEffect(() => {
    setStartTime(startTime)
    return () => reset()
  }, [startTime, setStartTime, reset])

  return <small className='text-sm text-white'>{formatTime(elapsedTime)}</small>
}

const formatTime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400) // 86400 seconds in a day
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(`${String(days).padStart(2, '0')}d`)
  if (hours > 0 || days > 0) parts.push(`${String(hours).padStart(2, '0')}h`)
  if (minutes > 0 || hours > 0 || days > 0)
    parts.push(`${String(minutes).padStart(2, '0')}m`)
  parts.push(`${String(secs).padStart(2, '0')}s`)

  return parts.join(' ')
}

export default Timer
