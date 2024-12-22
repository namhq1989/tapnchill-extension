import HeaderTitle from '@/modules/common/header-title.tsx'
import { ArrowLeft, ChevronRight, Dot, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { qrTypes } from '@/modules/qrcode/data.ts'
import { IQRCode, QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo, Link } from 'react-chrome-extension-router'
import CreateQRCodeURLForm from '@/modules/qrcode/create-url-form.tsx'
import CreateQRCodeTextForm from '@/modules/qrcode/create-text-form.tsx'
import CreateQRCodeEmailForm from '@/modules/qrcode/create-email-form.tsx'
import CreateQRCodeSMSForm from '@/modules/qrcode/create-sms-form.tsx'
import CreateQRCodeVCardForm from '@/modules/qrcode/create-vcard-form.tsx'
import CreateQRCodeLocationForm from '@/modules/qrcode/create-location-form.tsx'
import CreateQRCodeCryptocurrencyForm from '@/modules/qrcode/create-cryptocurrency-form.tsx'
import { format } from 'date-fns'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import LoadingIndicator from '@/modules/common/loading-indicator.tsx'
import { useEffect } from 'react'
import QRCodeDetailView from '@/modules/qrcode/detail.tsx'
import { Button } from '@/components/ui/button.tsx'
import PanelMenuItem from '@/modules/panel/menu-item.tsx'

const QRCodeView = () => {
  const {
    isBlocking,
    isFetching,
    qrCodes,
    fetchQRCodes,
    nextPageToken,
    loadMoreQRCodes,
  } = useQRCodeStore()

  useEffect(() => {
    const fetch = async () => {
      await fetchQRCodes()
    }

    fetch().then()
  }, [fetchQRCodes])

  if (isBlocking) {
    return (
      <div className='flex flex-col gap-8 w-full h-screen scrollbar-hide justify-center items-center'>
        <img src='/icons/icon128.png' alt='logo' width={48} height={48} />
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <ArrowLeft
          className='cursor-pointer'
          onClick={() => goTo(PanelMenuItem)}
        />
        <HeaderTitle title='QR Code' />
      </div>
      <div className='flex flex-col w-full p-4 gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='text-base font-bold tracking-wide'>
              Recent QR Codes
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='mr-4 w-[220px]'>
                {qrTypes.map((t) => {
                  const Icon = t.icon
                  return (
                    <DropdownMenuItem
                      key={t.value}
                      className='p-4 cursor-pointer'
                      onClick={() => {
                        if (t.value === QRCodeType.url) {
                          goTo(CreateQRCodeURLForm)
                        } else if (t.value === QRCodeType.text) {
                          goTo(CreateQRCodeTextForm)
                        } else if (t.value === QRCodeType.email) {
                          goTo(CreateQRCodeEmailForm)
                        } else if (t.value === QRCodeType.sms) {
                          goTo(CreateQRCodeSMSForm)
                        } else if (t.value === QRCodeType.vcard) {
                          goTo(CreateQRCodeVCardForm)
                        } else if (t.value === QRCodeType.location) {
                          goTo(CreateQRCodeLocationForm)
                        } else if (t.value === QRCodeType.cryptocurrency) {
                          goTo(CreateQRCodeCryptocurrencyForm)
                        }
                      }}
                    >
                      <Icon />
                      <p className='ml-2'>{t.label}</p>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='flex flex-col gap-2'>
            {qrCodes.length === 0 && (
              <div className='flex flex-col gap-2 items-center py-4 my-8'>
                <img
                  src='https://i.bapbi.app/illus-add-notes.svg'
                  alt='empty'
                  className='w-40 h-40 my-8'
                />
                <p className='text-base text-muted-foreground'>
                  You don't have any QR codes yet!
                </p>
              </div>
            )}
            {qrCodes.map((q) => {
              return <QRCodeItem key={q.id} qrCode={q} />
            })}
            {nextPageToken && (
              <Button
                variant='outline'
                className='mt-4'
                disabled={isFetching}
                onClick={loadMoreQRCodes}
              >
                Load more
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface IQRCodeItemProps {
  qrCode: IQRCode
}

const QRCodeItem = (props: IQRCodeItemProps) => {
  const { qrCode } = props
  const type = qrTypes.find((t) => t.value === qrCode.type)

  return (
    <div className='flex flex-row items-center justify-between p-4 container-selected rounded-xl'>
      <div className='flex flex-col gap-1'>
        <p className='text-sm'>{qrCode.name}</p>
        <div className='flex flex-row items-center'>
          <p className='text-sm text-muted-foreground'>
            {format(qrCode.createdAt, 'dd/MM/yyyy')}
          </p>
          <Dot className='text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>
            {type?.label || 'N/A'}
          </p>
        </div>
      </div>
      <Link component={QRCodeDetailView} props={{ qrCode }}>
        <ChevronRight className='cursor-pointer' />
      </Link>
    </div>
  )
}

export default QRCodeView
