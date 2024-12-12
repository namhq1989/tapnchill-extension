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
    checkProgress,
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
          clearInterval(timer!) // Stop the timer when countdown reaches zero
          checkProgress() // Reset the progress
        }
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer) // Clean up interval on component unmount or when isRunning changes
    }
  }, [isRunning, isResting, setCurrentCountdownSeconds, checkProgress])

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
          <div className='text-6xl font-bold tracking-wider font-mono w-[12ch] text-center'>
            {formatTimeToCountdown(currentCountdownSeconds)}
          </div>
          <div className='w-[80%] h-2 bg-gray-300 rounded-lg overflow-hidden'>
            <div
              className='h-full bg-primary transition-all duration-500'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className='flex w-full flex-shrink-0 p-4 items-center justify-center'>
          <img
            src={`https://i.bapbi.app/${isRunning ? 'illus-working-late' : 'illus-coffee-break'}.svg`}
            alt='focus'
            className='w-[60%] h-auto'
          />
        </div>
        <div className='flex w-full items-center justify-around gap-4 px-8'>
          <div className='flex flex-col'>
            <p className='text-sm text-muted-foreground'>
              Cycle {currentCycleCount + 1} of {numOfCycles} -{' '}
              {status === FocusStatus.running ? 'Focusing' : 'Resting'}
            </p>
            <p className='text-base font-bold'>{phaseText}</p>
          </div>
          {/*<Button*/}
          {/*  className='font-bold'*/}
          {/*  variant='default'*/}
          {/*  onClick={toggleRunning}*/}
          {/*>*/}
          {/*  {isRunning ? <Pause size={16} /> : <Play size={16} />}{' '}*/}
          {/*  {isRunning ? 'Pause' : 'Resume'}*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  className='font-bold'*/}
          {/*  variant='secondary'*/}
          {/*  onClick={resetProgress}*/}
          {/*>*/}
          {/*  <RotateCcw size={16} /> Reset*/}
          {/*</Button>*/}
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
        {/*<CircleStop size={40} className='cursor-pointer text-destructive' />*/}
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
