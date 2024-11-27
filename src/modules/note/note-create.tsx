import { useCreateBlockNote } from '@blocknote/react'
// import { BlockNoteView } from '@blocknote/shadcn'
// import '@blocknote/shadcn/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useTheme } from '@/components/theme/theme-provider.tsx'

const NoteCreateView = () => {
  const { theme } = useTheme()

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
      {
        type: 'paragraph',
      },
    ],
  })

  return (
    <div className='flex flex-col w-[800px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='New Note' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <BlockNoteView
          data-font-app
          data-theming
          data-color-scheme={theme}
          editor={editor}
        />
        <Button className='mt-4'>Add note</Button>
      </div>
    </div>
  )
}

export default NoteCreateView
