import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import useFocusSetupStore from '@/modules/focus/setup-store.ts'
import { Button } from '@/components/ui/button.tsx'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'

const FocusCompletedView = () => {
  const { focusTime, breakTime, numOfCycles } = useFocusSetupStore()
  const { stopSession } = useFocusProgressingStore()

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Focus' />
      </div>

      <div className='flex flex-col p-8 gap-8'>
        <div className='flex flex-col gap-8'>
          <img
            src='https://i.bapbi.app/confetti.png?v=2'
            alt='focus'
            className='w-[80px] h-[80px] bg-cover self-center'
          />
          <div className='flex flex-col text-center'>
            <p className='text-2xl font-bold'>Fantastic focus!</p>
            <p className='text-sm text-muted-foreground'>
              Enjoy your break and recharge for the next challenge ☕
            </p>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-between p-4 border-b-[1px]'>
            <p>Total Focus Time</p>
            <p className='text-sm text-primary font-bold'>
              {focusTime * numOfCycles} minutes
            </p>
          </div>
          <div className='flex flex-row items-center justify-between p-4 border-b-[1px]'>
            <p>Completed Cycles</p>
            <p className='text-sm text-primary font-bold'>{numOfCycles}</p>
          </div>
          <div className='flex flex-row items-center justify-between p-4'>
            <p>Break Time Take</p>
            <p className='text-sm text-primary font-bold'>
              {breakTime * numOfCycles} minutes
            </p>
          </div>
        </div>
        <Button className='font-bold' onClick={() => stopSession()}>
          Got It
        </Button>
      </div>
    </div>
  )
}

export default FocusCompletedView
