import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Link } from 'react-chrome-extension-router'
import CreateTaskView from '@/modules/task/task-create.tsx'
import { ListPlus, Plus } from 'lucide-react'
import TaskView from '@/modules/task/view.tsx'

interface BlockedSite {
  id: string // Unique identifier
  name: string // Display name of the site
  url: string // URL of the blocked site
  logo: string // URL of the logo image
  blockedSince: string // ISO date string (e.g., "2024-11-27T10:00:00Z")
}

interface BlockedSitesPreviewProps {
  blockedSites: BlockedSite[] // Array of blocked site objects
}
const BlockedSitesPreview = (props: BlockedSitesPreviewProps) => {
  const { blockedSites } = props
  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center px-4 py-2'>
        <h2 className='text-base font-bold tracking-wide'>Blocked Sites</h2>
        <div className='flex flex-row gap-4'>
          <Link component={CreateTaskView}>
            <Plus className='cursor-pointer' />
          </Link>
          <Link component={TaskView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex w-full col-span-1'>
        {blockedSites && blockedSites.length > 0 ? (
          <Carousel
            orientation='horizontal'
            opts={{
              align: 'start',
            }}
            className='w-full max-w-sm mx-4'
          >
            <CarouselContent>
              {blockedSites.slice(0, 5).map((site, index) => (
                <CarouselItem key={index} className='basis-1/2'>
                  <div
                    key={`site-${site.id}`}
                    className='flex flex-col gap-2 container-selected rounded-xl p-4'
                  >
                    <img
                      src={site.logo}
                      alt={`${site.name} logo`}
                      className='w-10 h-10 rounded-full'
                    />
                    <div>
                      <p className='text-sm font-bold'>{site.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        Blocked on:{' '}
                        {new Date(site.blockedSince).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/*<CarouselPrevious />*/}
            {/*<CarouselNext />*/}
          </Carousel>
        ) : (
          <p className='text-white text-sm'>No blocked sites added yet.</p>
        )}
      </div>
    </div>
  )
}

export default BlockedSitesPreview
