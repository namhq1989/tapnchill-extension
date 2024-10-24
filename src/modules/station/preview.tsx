import { Play, RadioTower } from 'lucide-react'

const StationPreview = () => {
  return (
    <div className='flex flex-col w-full min-h-[120px] rounded-lg gap-2'>
      <div>
        <div className='flex flex-row gap-4 justify-end'>
          <RadioTower />
        </div>
        <div className='flex'>
          <div className='flex rounded-lg h-[120px] aspect-square items-center justify-center'>
            <div className='flex w-20 h-20 bg-primary rounded-full justify-center items-center cursor-pointer'>
              <Play size={40} className='dark:stroke-black stroke-white' />
            </div>
          </div>
          <div className='flex flex-grow rounded-lg py-4 px-0'>
            <div className='flex flex-col'>
              <h2 className='text-lg font-bold'>
                Station Name Station Name Station Name Station Name
              </h2>
              <p className='text-sm text-muted-foreground'>0 audiences</p>
              <small className='text-sm font-medium mt-1'>
                Thoughtful, gentle songs, perfect as background music at home or
                work.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StationPreview
