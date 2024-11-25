import { Textarea } from '@/components/ui/textarea.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'

const SELECTED_TEXT_MAX_LENGTH = 150

export interface INoteCreateViewProps {
  selectedText: string
  pageTitle: string
  pageUrl: string
}

const NoteCreateView = (props: INoteCreateViewProps) => {
  const { selectedText, pageTitle, pageUrl } = props

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='New Note' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        {pageTitle && (
          <h4
            className='scroll-m-20 text-base mb-1 font-semibold tracking-tight truncate max-w-xs'
            title={pageTitle}
          >
            {pageTitle}
          </h4>
        )}
        {selectedText && (
          <blockquote className='text-sm mt-4 border-l-2 pl-4 italic whitespace-pre-line'>
            {selectedText.length > SELECTED_TEXT_MAX_LENGTH
              ? selectedText.slice(0, SELECTED_TEXT_MAX_LENGTH) + '...'
              : selectedText}
          </blockquote>
        )}
        {/*<p className='text-sm'>{pageUrl}</p>*/}
        <Textarea
          className='rounded-xl focus-visible:ring-transparent resize-none'
          placeholder='Note content'
          rows={8}
        />
        <Button>Add note</Button>
      </div>
    </div>
  )
}

export default NoteCreateView
