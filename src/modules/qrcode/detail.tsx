import { IQRCode, QRCodeSize, QRCodeType } from '@/modules/qrcode/types.ts'
import { downloadQRCode, renderQRCode } from '@/modules/qrcode/util.ts'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import QRCodeSettingsDisplay from '@/modules/qrcode/settings-display.tsx'
import { qrTypes } from '@/modules/qrcode/data.ts'
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { ArrowLeft, Download, Edit, Save, Trash2 } from 'lucide-react'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import useNotificationStore from '@/modules/notification/store.ts'
import { Textarea } from '@/components/ui/textarea.tsx'
import { goTo } from 'react-chrome-extension-router'
import QRCodeView from '@/modules/qrcode/view.tsx'
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

export interface IQRCodeDetailProps {
  qrCode: IQRCode
}

const QRCodeDetailView = (props: IQRCodeDetailProps) => {
  const { showNotification } = useNotificationStore()
  const { updateQRCode, deleteQRCode } = useQRCodeStore()
  const { qrCode } = props
  const type = qrTypes.find((t) => t.value === qrCode.type)

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(qrCode.name)
  const [selectedSize, setSelectedSize] = useState<QRCodeSize>(
    QRCodeSize.medium,
  )

  useEffect(() => {
    renderQRCode(qrCode.content, qrCode.settings)
  }, [qrCode])

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const toggleEditMode = async () => {
    if (isEditing) {
      if (name === qrCode.name) {
        setIsEditing(false)
        return
      }

      const isSuccess = await updateQRCode({ ...qrCode, name })
      if (isSuccess) {
        qrCode.name = name
        setIsEditing(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isEditing) {
      await toggleEditMode()
    }
  }

  const handleDownload = () => {
    downloadQRCode(qrCode, qrCode.settings, selectedSize, () => {
      showNotification({
        description: 'QR code downloaded successfully',
      })
    })
  }

  const handleDelete = async () => {
    const isSuccess = await deleteQRCode(qrCode)
    if (isSuccess) {
      goTo(QRCodeView)
    }
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <ArrowLeft
          className='cursor-pointer'
          onClick={() => goTo(QRCodeView)}
        />
        <HeaderTitle title='QR Code' />
      </div>
      <div className='flex flex-col w-full p-4 gap-4'>
        <div className='flex flex-col items-center justify-center my-8 gap-4 pb-4 border-b-[1px]'>
          <img id='image' alt='qr-code' className='w-[200px] mb-4' />
          <div className='flex items-center justify-center gap-4 mt-4'>
            <Select
              value={selectedSize.toString()}
              onValueChange={(value) =>
                setSelectedSize(Number(value) as QRCodeSize)
              }
            >
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Select size' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QRCodeSize)
                  .filter((value) => typeof value === 'number') // Ensure only numeric values are used
                  .map((value) => (
                    <SelectItem
                      key={value}
                      value={value.toString()}
                      disabled={
                        value === QRCodeSize.xlarge ||
                        value === QRCodeSize.xxlarge
                      } // Disable xlarge and xxlarge
                      className='flex items-center justify-between cursor-pointer'
                    >
                      <span>{value}px</span>
                      {(value === QRCodeSize.xlarge ||
                        value === QRCodeSize.xxlarge) && (
                        <Badge className='ml-4'>Pro</Badge>
                      )}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button variant='secondary' onClick={handleDownload}>
              <Download />
              Download
            </Button>
          </div>
          <QRCodeSettingsDisplay settings={qrCode.settings} />
        </div>
        <div className='flex flex-col gap-8'>
          <h2 className='text-base font-bold tracking-wide'>
            [{type?.label}] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name' className='flex justify-between items-center'>
              Name
              <button
                className='mr-2'
                onClick={toggleEditMode}
                aria-label={isEditing ? 'Save' : 'Edit'}
              >
                {isEditing ? <Save size={20} /> : <Edit size={20} />}
              </button>
            </Label>
            <Input
              id='name'
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              disabled={!isEditing} // Toggle edit mode
              placeholder='QR Code Name'
              className={isEditing ? 'border-primary' : ''}
            />
          </div>
          {qrCode.type === QRCodeType.url && qrCodeDetailURL(qrCode)}
          {qrCode.type === QRCodeType.text && qrCodeDetailText(qrCode)}
          {qrCode.type === QRCodeType.email && qrCodeDetailEmail(qrCode)}
          {qrCode.type === QRCodeType.sms && qrCodeDetailSms(qrCode)}
          {qrCode.type === QRCodeType.location && qrCodeDetailLocation(qrCode)}
          {qrCode.type === QRCodeType.cryptocurrency &&
            qrCodeDetailCryptoCurrency(qrCode)}
          {qrCode.type === QRCodeType.vcard && qrCodeDetailVCard(qrCode)}
          <DeleteQRCodeAlert onConfirm={handleDelete} />
        </div>
      </div>
    </div>
  )
}

interface IDeleteQRCodeAlertProps {
  onConfirm: () => void
}

const DeleteQRCodeAlert = (props: IDeleteQRCodeAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='w-full'>
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle />
          <AlertDialogDescription>
            Are you sure you want to delete this QR code? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const qrCodeDetailURL = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <Label htmlFor='url'>URL</Label>
      <Input
        id='url'
        placeholder='Your URL'
        value={qrCode.data.url}
        disabled={true}
      />
    </div>
  )
}

const qrCodeDetailText = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-2'>
      <Label htmlFor='text'>Text</Label>
      <Textarea
        id='text'
        value={qrCode.data.text}
        className='resize-none'
        disabled={true}
      />
    </div>
  )
}

const qrCodeDetailEmail = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='email'>Email Address</Label>
        <Input id='email' value={qrCode.data.email?.to} disabled={true} />
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='subject'>Subject</Label>
        <Input
          id='subject'
          value={qrCode.data.email?.subject}
          disabled={true}
        />
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='body'>Email Body</Label>
        <Textarea
          id='body'
          placeholder='Enter the email body'
          value={qrCode.data.email?.body}
          disabled={true}
          rows={8}
        />
      </div>
    </div>
  )
}

const qrCodeDetailSms = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='phoneNumber'>Phone Number</Label>
        <Input id='phoneNumber' value={qrCode.data.sms?.to} disabled={true} />
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='message'>Message</Label>
        <Textarea id='message' value={qrCode.data.sms?.body} disabled={true} />
      </div>
    </div>
  )
}

const qrCodeDetailLocation = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='latitude'>Latitude</Label>
          <Input
            id='latitude'
            value={qrCode.data.location?.latitude}
            disabled={true}
          />
        </div>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='longitude'>Longitude</Label>
          <Input
            id='longitude'
            value={qrCode.data.location?.longitude}
            disabled={true}
          />
        </div>
      </div>
    </div>
  )
}

const qrCodeDetailCryptoCurrency = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='currencyType'>Currency Type</Label>
        <Select
          defaultValue={qrCode.data.cryptocurrency?.currency}
          disabled={true}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select a currency' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='bitcoin'>Bitcoin (BTC)</SelectItem>
            <SelectItem value='ethereum'>Ethereum (ETH)</SelectItem>
            <SelectItem value='litecoin'>Litecoin (LTC)</SelectItem>
            <SelectItem value='dogecoin'>Dogecoin (DOGE)</SelectItem>
            {/*<SelectItem value='custom'>Other (Specify Below)</SelectItem>*/}
          </SelectContent>
        </Select>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='walletAddress'>Wallet Address</Label>
        <Input
          id='walletAddress'
          value={qrCode.data.cryptocurrency?.walletAddress}
          disabled={true}
        />
      </div>
      <div className='flex flex-col w-full gap-2'>
        <Label htmlFor='amount'>Amount (Optional)</Label>
        <Input id='amount' value={qrCode.data.cryptocurrency?.amount} />
      </div>
    </div>
  )
}

const qrCodeDetailVCard = (qrCode: IQRCode) => {
  return (
    <div className='flex flex-col w-full gap-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            id='firstName'
            value={qrCode.data.vcard?.firstName}
            disabled={true}
          />
        </div>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='lastName'>Last Name</Label>
          <Input
            id='lastName'
            value={qrCode.data.vcard?.lastName}
            disabled={true}
          />
        </div>
      </div>

      {/* Phone Number and Email in One Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='phoneNumber'>Phone Number</Label>
          <Input
            id='phoneNumber'
            value={qrCode.data.vcard?.phone}
            disabled={true}
          />
        </div>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' value={qrCode.data.vcard?.email} disabled={true} />
        </div>
      </div>

      {/* Organization and Job Title in One Row */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='organization'>Organization</Label>
          <Input
            id='organization'
            value={qrCode.data.vcard?.organization}
            disabled={true}
          />
        </div>
        <div className='flex flex-col w-full gap-2'>
          <Label htmlFor='title'>Job Title</Label>
          <Input id='title' value={qrCode.data.vcard?.job} disabled={true} />
        </div>
      </div>
    </div>
  )
}

export default QRCodeDetailView
