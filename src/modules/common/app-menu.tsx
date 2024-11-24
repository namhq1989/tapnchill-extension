import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.tsx'
import { useState } from 'react'
import { File, Info, Menu, MoonStar, StickyNote } from 'lucide-react'
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

const side = 'left'

const AppMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { showNotification } = useNotificationStore()
  const { provider, isGoogleSigningIn, googleSignIn, signOut, me } =
    useAppStore()

  if (!me) {
    return <div />
  }

  return (
    <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Menu className='cursor-pointer' />
      </SheetTrigger>
      <SheetContent side={side} className='p-0'>
        <div className='flex flex-col gap-1 p-2 mt-20'>
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
          <div className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'>
            <div className='flex flex-row gap-4 items-center justify-center'>
              <StickyNote size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Notes</p>
            </div>
          </div>
          <Link
            component={InformationView}
            className='flex flex-row items-center justify-between cursor-pointer rounded-xl hover:container-selected p-4'
          >
            <div className='flex flex-row gap-4 items-center justify-center'>
              <Info size={20} className='text-muted-foreground' />
              <p className='text-sm text-foreground'>Information</p>
            </div>
          </Link>
          <Separator className='w-[90%] mt-4 self-center' />
          {provider === 'extension' ? (
            <div className='flex flex-col p-4 w-full gap-4'>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-sm text-muted-foreground'>Current plan</p>
                <Badge variant='secondary'>Free</Badge>
              </div>
              <Button
                disabled={isGoogleSigningIn}
                variant='secondary'
                className='w-full h-[28px] rounded-xl font-bold'
                onClick={async () => await googleSignIn()}
              >
                <ChromeIcon className='mr-2 h-4 w-4' />
                Sign in with Google
              </Button>
            </div>
          ) : (
            <div className='flex flex-col p-4 w-full gap-4'>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-sm'>Current plan</p>
                <Badge variant='secondary'>
                  {me.subscription.plan.toUpperCase()}
                </Badge>
              </div>
              {me.subscription.plan === 'free' && (
                <Link component={SubscriptionView}>
                  <Button className='w-full h-[32px] rounded-xl font-bold'>
                    UPGRADE
                  </Button>
                </Link>
              )}
              {me.subscription.expiry && (
                <div className='flex flex-row items-center justify-between'>
                  <p className='text-sm'>
                    Renew on: {format(me.subscription.expiry, 'dd/MM/yyyy')}
                  </p>
                  <p className='text-xs underline underline-offset-4 cursor-pointer'>
                    Cancel
                  </p>
                </div>
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
              <p className='text-xs'>v1.0.0</p>
            </div>
          </div>
          <p
            className='text-xs underline underline-offset-4 cursor-pointer mt-20 self-center'
            onClick={() => signOut()}
          >
            Sign Out
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface IChromeIconProps {
  className?: string
}

const ChromeIcon = (props: IChromeIconProps) => {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <circle cx='12' cy='12' r='4' />
      <line x1='21.17' x2='12' y1='8' y2='8' />
      <line x1='3.95' x2='8.54' y1='6.06' y2='14' />
      <line x1='10.88' x2='15.46' y1='21.94' y2='14' />
    </svg>
  )
}

export default AppMenu
