import BackButton from '@/back-button.tsx'
import HeaderTitle from '@/header-title.tsx'

const HabitCreateView = () => {
  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Create activity' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'></div>
    </div>
  )
}

export default HabitCreateView
