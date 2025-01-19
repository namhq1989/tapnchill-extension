import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { useEffect, useState } from 'react'
import LoadingIndicator from '@/modules/common/loading-indicator.tsx'
import { ChevronRight } from 'lucide-react'

const HighlightView = () => {
  const [isFetching, setIsFetching] = useState(true)
  const [highlights, setHighlights] = useState([])

  useEffect(() => {
    chrome.storage.local.get(['highlights'], (result) => {
      const h = result.highlights
      setHighlights(h ? JSON.parse(h) : [])
      setIsFetching(false)
      console.log('highlights', highlights)
    })
  }, [highlights, setHighlights, setIsFetching])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Highlights' />
      </div>
      <div className='flex flex-col w-full gap-4 p-4'>
        {isFetching ? (
          <div className='flex flex-col mt-20 gap-4 w-full h-full justify-center items-center'>
            <img src='/icons/icon128.png' alt='logo' width={48} height={48} />
            <LoadingIndicator />
          </div>
        ) : (
          <div className='flex flex-col w-full gap-4 justify-center items-center'>
            {highlights.length === 0 && (
              <div className='flex flex-col gap-2 items-center py-4 my-8'>
                <img
                  src='https://i.bapbi.app/illus-add-notes.svg'
                  alt='empty'
                  className='w-40 h-40 my-8'
                />
                <p className='text-base text-muted-foreground'>
                  You don't have any Highlights yet!
                </p>
              </div>
            )}
            {Object.entries(highlights).map(
              (
                [
                  url,
                  items,
                ]: [
                  string,
                  [never],
                ],
                index,
              ) => {
                const u = new URL(url)
                const { hostname, pathname } = u
                return (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 container-selected rounded-xl w-full gap-2'
                  >
                    <div className='flex flex-col justify-center items-start gap-2'>
                      <p className='text-sm font-bold'>{hostname + pathname}</p>
                      <span className='text-sm text-muted-foreground'>
                        {items.length} highlight{items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronRight
                      className='cursor-pointer'
                      onClick={() => {
                        window.open(url, '_blank')
                      }}
                    />
                  </div>
                )
              },
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HighlightView
