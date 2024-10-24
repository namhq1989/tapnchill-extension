import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { AlarmClock, Menu, Sparkles } from 'lucide-react'

const side = 'right'

const Sidebar = () => {
  return (
    <div className='flex self-end cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <Menu size={28} />
        </SheetTrigger>
        <SheetContent side={side}>
          <div className='flex flex-col items-end mt-16 space-y-4'>
            <div className='flex items-center'>
              <p className='text-lg mr-4 font-bold'>Effects</p>
              <Sparkles />
            </div>
            <div className='flex items-center'>
              <p className='text-lg mr-4 font-bold'>Timer</p>
              <AlarmClock />
            </div>
          </div>
          {/*<SheetFooter>*/}
          {/*  <ModeToggle />*/}
          {/*</SheetFooter>*/}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Sidebar
