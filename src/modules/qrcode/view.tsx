import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { ChevronRight, Dot, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { qrTypes } from '@/modules/qrcode/data.ts'
import { QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo } from 'react-chrome-extension-router'
import CreateQRCodeURLForm from '@/modules/qrcode/create-url-form.tsx'
import CreateQRCodeTextForm from '@/modules/qrcode/create-text-form.tsx'
import CreateQRCodeEmailForm from '@/modules/qrcode/create-email-form.tsx'
import CreateQRCodeSMSForm from '@/modules/qrcode/create-sms-form.tsx'
import CreateQRCodeVCardForm from '@/modules/qrcode/create-vcard-form.tsx'
import CreateQRCodeLocationForm from '@/modules/qrcode/create-location-form.tsx'
import CreateQRCodeCryptocurrencyForm from '@/modules/qrcode/create-cryptocurrency-form.tsx'

const QRCodeView = () => {
  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
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
            <QRCodeItem />
            <QRCodeItem />
            <QRCodeItem />
            <QRCodeItem />
            <QRCodeItem />
          </div>
        </div>
      </div>
    </div>
  )
}

const QRCodeItem = () => {
  return (
    <div className='flex flex-row items-center justify-between p-4 container-selected rounded-xl'>
      <div className='flex flex-col gap-1'>
        <p className='text-sm'>QR code name</p>
        <div className='flex flex-row items-center justify-center'>
          <p className='text-sm text-muted-foreground'>25/12/2024</p>
          <Dot className='text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Link</p>
        </div>
      </div>
      <ChevronRight />
    </div>
  )
}

export default QRCodeView
