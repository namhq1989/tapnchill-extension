import { useEffect, useState } from 'react'
import useHighlightStore from '@/modules/highlight/store.ts'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input.tsx'
import { IHighlight } from '@/modules/highlight/types.ts'

const HighlightView = () => {
  const { highlights, initHighlights } = useHighlightStore()
  const [keyword, setKeyword] = useState('')
  const [filteredHighlights, setFilteredHighlights] = useState<IHighlight[]>([])

  // Initialize highlights only once
  useEffect(() => {
    initHighlights()
  }, [initHighlights]) // Ensure this runs only on component mount

  // Filter highlights when the keyword changes
  useEffect(() => {
    if (keyword) {
      const filtered = highlights.filter((item) =>
        item.url.toLowerCase().includes(keyword.toLowerCase()),
      )
      setFilteredHighlights(filtered)
    } else {
      setFilteredHighlights(highlights)
    }
  }, [highlights, keyword])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Highlights' />
      </div>
      <div className='flex flex-col w-full gap-4 p-4'>
        {filteredHighlights.length === 0 ? (
          <div className='flex flex-col gap-2 items-center py-4 my-8'>
            {/*<p className='text-base text-muted-foreground'>*/}
            {/*  You don't have any Highlights yet!*/}
            {/*</p>*/}
            <div className='flex flex-col p-4 items-start space-y-4'>
              <h2 className='text-base font-semibold'>How to Highlight Text</h2>
              <ol className='list-decimal list-inside text-sm space-y-2'>
                <li>
                  <span className='font-medium'>1. Select Text:</span> Highlight
                  the text you want.
                </li>
                <li>
                  <span className='font-medium'>2. Right-Click:</span> Open the
                  context menu.
                </li>
                <li>
                  <span className='font-medium'>3. Choose "BapBi":</span> Click{' '}
                  <em>Highlight This Text</em>.
                </li>
              </ol>
              <p className='text-sm'>
                Your text is now highlighted and saved! 🎉
              </p>
              <video
                src='https://i.bapbi.app/highlight-guide.mp4?v=2'
                controls
                className='w-full h-auto rounded-md shadow-lg'
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <div className='flex flex-col w-full gap-4'>
            <Input
              placeholder='Url'
              onChange={(e) => {
                setKeyword(e.target.value)
              }}
            />
            {filteredHighlights.map((item, index) => {
              const u = new URL(item.url)
              const { hostname, pathname } = u
              return (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 container-selected rounded-xl gap-2'
                >
                  <div className='flex flex-col justify-center items-start'>
                    <p className='text-sm font-bold'>{hostname + pathname}</p>
                    <span className='text-sm text-muted-foreground'>
                      {item.numOfHighlights} highlight
                      {item.numOfHighlights > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className='flex w-8 h-8  items-center justify-end'>
                    <ChevronRight
                      className='cursor-pointer'
                      onClick={() => {
                        window.open(item.url, '_blank')
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HighlightView
