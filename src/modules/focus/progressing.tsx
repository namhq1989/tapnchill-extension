import { useEffect } from 'react'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { formatTimeToCountdown } from '@/lib/date.ts'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'
import { FocusStatus } from '@/modules/focus/types.ts'
import { Button } from '@/components/ui/button.tsx'

const FocusProgressingView = () => {
  const {
    currentCountdownSeconds,
    setCurrentCountdownSeconds,
    numOfCycles,
    currentCycleCount,
    status,
    progress,
    stopSession,
    phaseText,
  } = useFocusProgressingStore()
  const isRunning = status === FocusStatus.running
  const isResting = status === FocusStatus.resting

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRunning || isResting) {
      timer = setInterval(() => {
        const { currentCountdownSeconds } = useFocusProgressingStore.getState()

        if (currentCountdownSeconds > 0) {
          setCurrentCountdownSeconds(currentCountdownSeconds - 1) // Decrement countdown
        } else {
          clearInterval(timer!)
        }
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, isResting, setCurrentCountdownSeconds])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      {/* Header */}
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Focus' />
      </div>

      {/* Content */}
      <div className='flex flex-col flex-1 items-center justify-center gap-4'>
        <div className='flex flex-col w-full p-4 gap-4 justify-center items-center'>
          <div className='text-6xl font-bold tracking-wider tabular-nums w-[12ch] text-center'>
            {formatTimeToCountdown(currentCountdownSeconds)}
          </div>
          <div className='w-[80%] h-2 bg-gray-300 rounded-lg overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-500'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className='flex flex-shrink-0 p-4 items-center justify-center w-[60%]'>
          <img
            src={`https://i.bapbi.app/${isRunning ? 'illus-working-late' : 'illus-coffee-break'}.svg`}
            alt='focus'
            className='bg-cover'
          />
        </div>
        <div className='flex w-full items-center justify-around gap-4 px-8'>
          <div className='flex flex-col'>
            <p className='text-sm text-muted-foreground'>
              Cycle {currentCycleCount + 1} of {numOfCycles} -{' '}
              {status === FocusStatus.running ? 'Focusing' : 'Resting'}
            </p>
            <p className='text-sm font-bold'>{phaseText}</p>
          </div>
          <StopFocus onConfirm={stopSession} />
        </div>
      </div>
    </div>
  )
}

interface IStopFocusProps {
  onConfirm: () => void
}

const StopFocus = (props: IStopFocusProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='font-bold' variant='destructive'>
          Stop Focus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle />
          <AlertDialogDescription>
            Are you sure you want to stop the Focus session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, keep going</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Yes, stop
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default FocusProgressingView
