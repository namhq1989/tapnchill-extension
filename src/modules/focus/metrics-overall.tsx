import { useEffect, useState } from 'react'
import useFocusMetricsStore from '@/modules/focus/metrics-store.ts'
import { IFocusOverallMetrics } from '@/modules/focus/types.ts'
import { Separator } from '@/components/ui/separator.tsx'
import { formatNumber } from '@/lib/string.ts'

const FocusMetricsOverall = () => {
  const { fetchOverallMetrics } = useFocusMetricsStore()
  const [data, setData] = useState<IFocusOverallMetrics | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchOverallMetrics()
      setData(fetchedData)
    }
    fetchData().then()
  }, [fetchOverallMetrics])

  if (!data) return null

  return (
    <div className='flex flex-col w-full gap-4 mt-4'>
      <div className='flex flex-col'>
        <h2 className='text-base font-bold tracking-wide'>Overall</h2>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Sessions Initiated</p>
            <p className='text-xs text-muted-foreground'>
              Number of sessions you started
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(data.totalSessions)}
            </p>
          </div>
        </div>
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Sessions Completed</p>
            <p className='text-xs text-muted-foreground'>
              Sessions fully completed
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(data.completedSessions)}
            </p>
          </div>
        </div>
        <Separator className='my-2' />
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Focus Time</p>
            <p className='text-xs text-muted-foreground'>
              Your total time spent in focus mode
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(data.totalFocusTime, 'time')}
            </p>
          </div>
        </div>
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Rest Time</p>
            <p className='text-xs text-muted-foreground'>
              The accumulated time spent resting
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(data.totalRestTime, 'time')}
            </p>
          </div>
        </div>
        <Separator className='my-2' />
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Average Focus Time</p>
            <p className='text-xs text-muted-foreground'>
              Average time per focus phase
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(
                Math.round(data.totalFocusTime / data.totalSessions),
                'time',
              )}
            </p>
          </div>
        </div>
        <div className='flex flex-row h-[40px] items-center justify-between gap-4'>
          <div className='flex-grow'>
            <p className='text-sm font-medium'>Best Focus Time</p>
            <p className='text-xs text-muted-foreground'>
              Your longest focus time
            </p>
          </div>
          <div className='flex min-w-[100px] h-full flex-shrink-0 justify-end items-center'>
            <p className='text-base text-primary font-bold'>
              {formatNumber(data.longestFocusPhase, 'time')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FocusMetricsOverall
