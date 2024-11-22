import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'

const SubscriptionView = () => {
  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Plans' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <p className='text-sm'>
          This app is free to use and offers everything you need to get started.
          If you need more flexibility, the Pro plan simply increases the limits
          on certain features, giving you more space to stay productive and
          relaxed.
        </p>
        <div className='flex flex-row justify-between items-center container-selected px-8 py-4 rounded-xl'>
          <div className='flex flex-col'>
            <p className='text-3xl font-bold text-primary'>$3</p>
            <p className='text-sm text-muted-foreground'>per month</p>
          </div>
          <p className='text-sm text-primary font-bold underline underline-offset-4 cursor-pointer'>
            UPGRADE
          </p>
        </div>
        <div className='flex flex-row justify-between items-center container-selected px-8 py-4 rounded-xl'>
          <div className='flex flex-col'>
            <div className='flex flex-row gap-2 items-end'>
              <p className='text-3xl font-bold text-primary'>$30</p>
              <p className='text-xl text-primary line-through mb-[2px]'>$36</p>
            </div>
            <p className='text-sm text-muted-foreground'>per year</p>
          </div>
          <p className='text-sm text-primary font-bold underline underline-offset-4 cursor-pointer'>
            UPGRADE
          </p>
        </div>

        <div className='flex flex-col mt-8'>
          <h3 className='scroll-m-20 text-xl font-semibold tracking-tight mb-2'>
            Comparison Table
          </h3>
          <div className='flex flex-row px-0 py-2 border-b-2 border-b-muted items-center justify-center'>
            <div className='flex w-[40%] items-start'>
              <p className='text-sm font-bold'>Feature</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-sm font-bold'>Free</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-sm font-bold'>Pro</p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted '>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Radio station</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>All</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>All</p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Ambiences</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>Play up to 1</p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>Play unlimited</p>
              {/*<p className='text-xs'>Custom presets</p>*/}
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Habit Tracking</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>Max 5 habits</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>Max 20 habits</p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Task Management</p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>Max 5 goals</p>
              <p className='text-xs'>Max 20 tasks per goal</p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>Max 20 goals</p>
              <p className='text-xs'>Max 50 tasks per goal</p>
            </div>
          </div>
          <div className='flex px-0 py-4'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Other features</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>All</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>All</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionView
