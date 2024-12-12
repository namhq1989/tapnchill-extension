import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Ban, Pause, Play, RotateCcw } from 'lucide-react'
import { formatTimeToCountdown } from '@/lib/date.ts'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'
import { FocusStatus } from '@/modules/focus/types.ts'

const FocusProgressingView = () => {
  const {
    countdown,
    status,
    progress,
    setCountdown,
    toggleRunning,
    checkProgress,
    stopFocus,
  } = useFocusProgressingStore()
  const isRunning = status === FocusStatus.running

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRunning) {
      timer = setInterval(() => {
        const currentCountdown = useFocusProgressingStore.getState().countdown

        if (currentCountdown > 0) {
          setCountdown(currentCountdown - 1) // Decrement countdown
        } else {
          clearInterval(timer!) // Stop the timer when countdown reaches zero
          checkProgress() // Reset the progress
        }
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer) // Clean up interval on component unmount or when isRunning changes
    }
  }, [isRunning, setCountdown, checkProgress])

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
            {formatTimeToCountdown(countdown)}
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
            src='https://i.bapbi.app/illus-working-late.svg'
            alt='focus'
            className='w-[70%] h-auto'
          />
        </div>
        <div className='flex w-full items-center justify-around gap-4 mt-4 px-8'>
          <Button
            className='font-bold'
            variant='default'
            onClick={toggleRunning}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}{' '}
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            className='font-bold'
            variant='secondary'
            onClick={resetProgress}
          >
            <RotateCcw size={16} /> Reset
          </Button>
          <StopFocus onConfirm={stopFocus} />
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
          <Ban size={16} /> Stop
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to stop the Focus timer?
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
