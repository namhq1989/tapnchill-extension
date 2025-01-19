import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { useEffect, useState } from 'react'
import LoadingIndicator from '@/modules/common/loading-indicator.tsx'

const HighlightView = () => {
  const [isFetching, setIsFetching] = useState(true)
  const [highlights, setHighlights] = useState([])

  useEffect(() => {
    chrome.storage.local.get(['highlights'], (result) => {
      setHighlights(JSON.parse(result.highlights) || [])
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
      <div className='flex flex-col w-full gap-4'>
        {isFetching ? (
          <div className='flex w-full h-full justify-center items-center'>
            <img src='/icons/icon128.png' alt='logo' width={48} height={48} />
            <LoadingIndicator />
          </div>
        ) : (
          <div className='flex w-full gap-4 justify-center items-center'>
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
                const domain = new URL(url).hostname
                return (
                  <div
                    key={index}
                    className='flex flex-col p-4 container-selected pb-8 rounded-xl'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='text-base font-bold'>{domain}</span>
                      <div
                        className='relative group cursor-pointer'
                        title={url}
                      >
                        <span
                          className='text-gray-500'
                          onClick={() => window.open(url, '_blank')}
                        >
                          ℹ️
                        </span>
                        <div className='absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 z-10'>
                          {url}
                        </div>
                      </div>
                    </div>
                    <span className='text-xs'>
                      {items.length} highlight{items.length > 1 ? 's' : ''}
                    </span>
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
