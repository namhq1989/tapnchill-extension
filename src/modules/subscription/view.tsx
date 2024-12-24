import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import useAppStore from '@/modules/common/store.ts'
import ChromeIcon from '@/modules/common/chrome-icon.tsx'

const SubscriptionView = () => {
  const {
    isSubscriptionEnabled,
    subscriptionPlans,
    resourcesLimitation,
    isGeneratingSubscriptionCheckoutURL,
    generateSubscriptionCheckoutURL,
    isGoogleSigningIn,
    googleSignIn,
    provider,
  } = useAppStore()

  const isUserNotSignedInYet = !provider || provider === 'extension'

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
        {!subscriptionPlans.length ? (
          <div className='flex flex-col w-full h-[100px] justify-center items-center'>
            Something went wrong. Please try again!
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-2'>
            {subscriptionPlans.map((plan) => {
              let pricingDiv = (
                <p className='text-3xl font-bold text-primary'>
                  ${plan.amount}
                </p>
              )

              if (plan.amount !== plan.afterDiscountAmount) {
                pricingDiv = (
                  <div className='flex flex-row gap-2 items-end'>
                    <p className='text-3xl font-bold text-primary'>
                      ${plan.afterDiscountAmount}
                    </p>
                    <p className='text-xl text-primary line-through mb-[2px]'>
                      ${plan.amount}
                    </p>
                  </div>
                )
              }

              return (
                <div
                  key={`plan-${plan.id}`}
                  className='col-span-1 flex flex-col justify-between items-start container-selected px-4 py-4 rounded-xl gap-4'
                >
                  <div className='flex flex-col'>
                    {pricingDiv}
                    <p className='text-sm'>per {plan.id}</p>
                  </div>

                  <Button
                    className='w-full h-[28px] rounded-xl font-bold'
                    disabled={
                      isUserNotSignedInYet ||
                      !isSubscriptionEnabled ||
                      isGeneratingSubscriptionCheckoutURL
                    }
                    onClick={async () => {
                      const url = await generateSubscriptionCheckoutURL(plan.id)
                      window.open(
                        `${import.meta.env.VITE_LANDING_PAGE_URL}?c=${url}`,
                        '_blank',
                      )
                    }}
                  >
                    UPGRADE
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {isUserNotSignedInYet && (
          <div className='flex flex-col gap-2 mt-4'>
            <p className='text-sm'>Please sign in first</p>
            <Button
              disabled={isGoogleSigningIn}
              className='w-full h-[32px] rounded-xl'
              onClick={async () => await googleSignIn()}
            >
              <ChromeIcon className='mr-2 h-4 w-4' />
              Sign in with Google
            </Button>
          </div>
        )}

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
              <p className='text-xs'>Play up to 2</p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>
                Play <span className='text-primary'>Unlimited</span>
              </p>
              {/*<p className='text-xs'>Custom presets</p>*/}
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Note</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max {resourcesLimitation.note.free} notes
              </p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max{' '}
                <span className='text-primary'>
                  {resourcesLimitation.note.pro}
                </span>{' '}
                notes
              </p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Habit Tracking</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max {resourcesLimitation.habit.free} habits
              </p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max{' '}
                <span className='text-primary'>
                  {resourcesLimitation.habit.pro}
                </span>{' '}
                habits
              </p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Task Management</p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>
                Max {resourcesLimitation.goal.free} goals
              </p>
              <p className='text-xs'>
                Max {resourcesLimitation.task.free} tasks per goal
              </p>
            </div>
            <div className='flex flex-col w-[30%] items-start gap-1'>
              <p className='text-xs'>
                Max{' '}
                <span className='text-primary'>
                  {resourcesLimitation.goal.pro}
                </span>{' '}
                goals
              </p>
              <p className='text-xs'>
                Max{' '}
                <span className='text-primary'>
                  {resourcesLimitation.task.pro}
                </span>{' '}
                tasks per goal
              </p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>QR Code</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max {resourcesLimitation.qrCode.free} codes
              </p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Max{' '}
                <span className='text-primary'>
                  {resourcesLimitation.qrCode.pro}
                </span>{' '}
                codes
              </p>
            </div>
          </div>
          <div className='flex px-0 py-4 border-b-2 border-b-muted'>
            <div className='flex w-[40%] items-start'>
              <p className='text-xs'>Focus</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>Block up to 5 websites</p>
            </div>
            <div className='flex w-[30%] items-start'>
              <p className='text-xs'>
                Block up to <span className='text-primary'>50</span> websites
              </p>
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
