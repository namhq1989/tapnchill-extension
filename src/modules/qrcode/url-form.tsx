import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'

interface QRCodeURLFormProps {
  url: string
  setUrl: (value: string) => void
}

const QRCodeURLForm = ({ url, setUrl }: QRCodeURLFormProps) => {
  return (
    <div className='grid w-full max-w-sm items-center gap-1.5'>
      <Label htmlFor='url'>URL</Label>
      <Input
        id='url'
        placeholder='Your URL'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  )
}

export default QRCodeURLForm
