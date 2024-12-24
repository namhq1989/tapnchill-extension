import { Label } from '@/components/ui/label.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import QRCodeSettings from '@/modules/qrcode/settings.tsx'
import { useCallback, useEffect, useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'
import useQRCodeStore from '@/modules/qrcode/store.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { renderQRCode } from '@/modules/qrcode/util.ts'
import { QRCodeType } from '@/modules/qrcode/types.ts'
import { goTo } from 'react-chrome-extension-router'
import QRCodeDetailView from '@/modules/qrcode/detail.tsx'

const CreateQRCodeCryptocurrencyForm = () => {
  const { showErrorNotification } = useNotificationStore()
  const { isBlocking, settings, createQRCode } = useQRCodeStore()

  const [name, setName] = useState('')
  const [currencyType, setCurrencyType] = useState('bitcoin')
  const [customCurrency, setCustomCurrency] = useState('')
  const [walletAddress, setWalletAddress] = useState('YOUR_WALLET_ADDRESS')
  const [amount, setAmount] = useState('')

  const handleRender = useCallback(() => {
    const finalCurrency =
      currencyType === 'custom' ? customCurrency : currencyType

    if (!finalCurrency.trim()) {
      showErrorNotification({
        description: 'Please select a currency or provide a custom coin code',
      })
      return
    }

    if (!walletAddress.trim()) {
      showErrorNotification({
        description: 'Please enter a valid wallet address',
      })
      return
    }

    // Format the Cryptocurrency QR code content
    const cryptoContent = `${finalCurrency}:${walletAddress}${amount ? `?amount=${amount}` : ''}`
    renderQRCode(cryptoContent.trim(), settings)
  }, [
    currencyType,
    customCurrency,
    walletAddress,
    amount,
    settings,
    showErrorNotification,
  ])

  useEffect(() => {
    handleRender()
  }, [handleRender])

  const create = async () => {
    const finalCurrency =
      currencyType === 'custom' ? customCurrency : currencyType

    if (!finalCurrency.trim()) {
      showErrorNotification({
        description: 'Please select a currency or provide a custom coin code',
      })
      return
    }

    if (!walletAddress.trim() || walletAddress === 'YOUR_WALLET_ADDRESS') {
      showErrorNotification({
        description: 'Please enter a valid wallet address',
      })
      return
    }

    const { qrCode, isSuccess } = await createQRCode(
      name,
      QRCodeType.cryptocurrency,
      `${finalCurrency}:${walletAddress}${amount ? `?amount=${amount}` : ''}`,
      settings,
      {
        cryptocurrency: {
          currency: finalCurrency,
          walletAddress,
          amount: Number(amount),
        },
      },
    )

    if (isSuccess) {
      goTo(QRCodeDetailView, { qrCode })
    }
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Create QR Code' />
      </div>
      <div className='flex flex-col w-full p-4'>
        <div className='flex flex-col items-center justify-center my-8 gap-4 pb-4 border-b-[1px]'>
          <img id='image' alt='qr-code' className='w-[200px] mb-4' />
          <QRCodeSettings />
        </div>
        <div className='flex flex-col gap-8'>
          <h2 className='text-base font-bold tracking-wide'>
            [CRYPTO CURRENCY] QR Code Details
          </h2>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='QR Code Name'
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='currencyType'>Currency Type</Label>
            <Select
              onValueChange={(value) => {
                setCurrencyType(value)
                handleRender()
              }}
              defaultValue={currencyType}
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
          {currencyType === 'custom' && (
            <div className='flex flex-col w-full gap-2'>
              <Label htmlFor='customCurrency'>Custom Coin Code</Label>
              <Input
                id='customCurrency'
                placeholder='Enter custom coin code (e.g., XRP)'
                value={customCurrency}
                onChange={(e) => {
                  setCustomCurrency(e.target.value)
                  handleRender()
                }}
              />
            </div>
          )}
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='walletAddress'>Wallet Address</Label>
            <Input
              id='walletAddress'
              placeholder='Enter wallet address'
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value)
                handleRender()
              }}
            />
          </div>
          <div className='flex flex-col w-full gap-2'>
            <Label htmlFor='amount'>Amount (Optional)</Label>
            <Input
              id='amount'
              type='number'
              min={0}
              placeholder='Enter amount (e.g., 0.01)'
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                handleRender()
              }}
            />
          </div>
          <Button disabled={isBlocking} className='font-bold' onClick={create}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateQRCodeCryptocurrencyForm
