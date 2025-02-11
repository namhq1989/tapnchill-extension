import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx'
import { useState } from 'react'
import {
  CircleCheckBig,
  File,
  Info,
  ListChecks,
  Menu,
  MoonStar,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch.tsx'
import { Link } from 'react-chrome-extension-router'
import InformationView from '@/modules/information/view.tsx'
import { useTheme } from '@/components/theme/theme-provider.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { copyToClipboard } from '@/lib/string.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { Button } from '@/components/ui/button.tsx'
import useAppStore from '@/modules/common/store.ts'
import { format } from 'date-fns'
import SubscriptionView from '@/modules/subscription/view.tsx'
import HabitView from '@/modules/habit/view.tsx'
import TaskView from '@/modules/task/view.tsx'
import ChromeIcon from '@/modules/common/chrome-icon.tsx'

const side = 'left'

const AppMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { showNotification } = useNotificationStore()
  const {
    provider,
    email,
    isGoogleSigningIn,
    googleSignIn,
    isSubscriptionEnabled,
    isGettingPaymentCustomerPortalURL,
    getPaymentCustomerPortalURL,
    me,
  } = useAppStore()

  if (!me) {
    return <div />
  }

  const isFree = me.subscription.plan === 'free'

  return (
    <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Menu className='cursor-pointer' />
      </SheetTrigger>
      <SheetContent side={side} className='p-0 scrollbar-hide overflow-auto'>
        <div className='flex flex-col gap-1 p-2 mt-16'>
          {/*<div*/}
          {/*  className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'*/}
          {/*  onClick={() => {*/}
          {/*    chrome.windows.getCurrent({ populate: true }, (window) => {*/}
          {/*      const windowId = window.id || 0*/}
          {/*      chrome.sidePanel.open({ windowId }).then(() => {*/}
          {/*        chrome.extension*/}
          {/*          .getViews({ type: 'popup' })*/}
          {/*          .forEach((v) => v.close())*/}
          {/*      })*/}
          {/*    })*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <div className='flex flex-row gap-4 items-center justify-center'>*/}
          {/*    <StickyNote size={20} className='text-muted-foreground' />*/}
          {/*    <p className='text-sm text-foreground'>Note</p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <Link
            component={HabitView}
            className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'
          >
            <div className='flex flex-row gap-4 items-center justify-center'>
              <ListChecks size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Habit</p>
            </div>
          </Link>
          <Link
            component={TaskView}
            className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'
          >
            <div className='flex flex-row gap-4 items-center justify-center'>
              <CircleCheckBig size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Task</p>
            </div>
          </Link>
          <Link
            component={InformationView}
            className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'
          >
            <div className='flex flex-row gap-4 items-center justify-center'>
              <Info size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Information</p>
            </div>
          </Link>
          <div className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'>
            <div className='flex flex-row gap-4 items-center justify-center'>
              <MoonStar size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Dark mode</p>
            </div>
            <Switch
              defaultChecked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light')
              }}
            />
          </div>
          <Separator className='w-[90%] mt-4 self-center' />
          {!provider || provider === 'extension' ? (
            <div className='flex flex-col p-4 w-full gap-4'>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-sm text-muted-foreground'>Current plan</p>
                <Badge variant='secondary'>Free</Badge>
              </div>
              <Button
                disabled={isGoogleSigningIn}
                className='w-full h-[32px] rounded-xl'
                onClick={async () => await googleSignIn()}
              >
                <ChromeIcon className='mr-2 h-4 w-4' />
                Sign in with Google
              </Button>
            </div>
          ) : (
            <div className='flex flex-col p-4 w-full gap-4'>
              <p
                className='text-sm truncate'
                title={email || 'Your account email'}
              >
                {email || 'N/A'}
              </p>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-sm'>Current plan</p>
                <Badge variant={isFree ? 'secondary' : 'default'}>
                  {me.subscription.plan.toUpperCase()}
                </Badge>
              </div>
              {isFree && isSubscriptionEnabled && (
                <Link component={SubscriptionView}>
                  <Button className='w-full h-[32px] rounded-xl font-bold'>
                    UPGRADE
                  </Button>
                </Link>
              )}
              {me.subscription.expiry && (
                <div className='flex flex-row items-center justify-between'>
                  <p className='text-sm'>Renew on:</p>
                  <p className='text-sm font-bold'>
                    {format(me.subscription.expiry, 'dd/MM/yyyy')}
                  </p>
                </div>
              )}
              {!isFree && (
                <Button
                  disabled={isGettingPaymentCustomerPortalURL}
                  variant='secondary'
                  className='w-full h-[32px] rounded-xl'
                  onClick={async () => {
                    const url = await getPaymentCustomerPortalURL()
                    if (url) {
                      window.open(url, '_blank')
                    }
                  }}
                >
                  Manage Plan
                </Button>
              )}
            </div>
          )}
          <Separator className='w-[90%] mb-4 self-center' />
          <div className='flex flex-col'>
            <div className='flex flex-row items-center justify-between px-4 py-1 w-full'>
              <p className='text-xs text-foreground'>Your IP</p>
              <div
                className='flex flex-row gap-1 items-center cursor-pointer'
                onClick={() => {
                  copyToClipboard(me.ip)
                  showNotification({
                    description: 'Copied to clipboard',
                  })
                }}
              >
                <File size={12} />
                <p className='text-xs'>{me.ip}</p>
              </div>
            </div>
            <div className='flex flex-row items-center justify-between px-4 py-1 w-full'>
              <p className='text-xs'>Extension version</p>
              <p className='text-xs'>v1.0.9</p>
            </div>
          </div>
          <div className='flex flex-col my-8 items-center justify-center'>
            <a
              href='https://chromewebstore.google.com/detail/ahpbddfeddnminklkodiapofdddmcmlb'
              target='_blank'
            >
              <p className='text-sm text-primary underline underline-offset-4'>
                View on Chrome Store
              </p>
            </a>
          </div>
          {/*<p*/}
          {/*  className='text-xs underline underline-offset-4 cursor-pointer mt-20 self-center'*/}
          {/*  onClick={() => signOut()}*/}
          {/*>*/}
          {/*  Sign Out*/}
          {/*</p>*/}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default AppMenu
