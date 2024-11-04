import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import useNoteStore from '@/modules/note/store.ts'
import { Textarea } from '@/components/ui/textarea.tsx'

const SELECTED_TEXT_MAX_LENGTH = 150

const NoteCreateView = () => {
  const { isCreateNoteDialogOpen, closeCreateNoteDialog, selectedText, title } =
    useNoteStore()

  return (
    <Dialog open={isCreateNoteDialogOpen} defaultOpen={false}>
      <DialogContent className='w-[94%]'>
        <DialogHeader>
          <DialogTitle className='self-start'>Add note</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          {selectedText && (
            <blockquote className='text-sm mt-4 border-l-2 pl-4 italic whitespace-pre-line'>
              <h4
                className='scroll-m-20 text-base mb-1 font-semibold tracking-tight truncate max-w-xs'
                title={title}
              >
                {title}
              </h4>
              {selectedText.length > SELECTED_TEXT_MAX_LENGTH
                ? selectedText.slice(0, SELECTED_TEXT_MAX_LENGTH) + '...'
                : selectedText}
            </blockquote>
          )}
          <Textarea
            className='rounded-xl focus-visible:ring-transparent resize-none'
            placeholder='Note content'
            rows={8}
          />
        </div>
        <DialogFooter className='gap-4'>
          <Button variant='outline' onClick={() => closeCreateNoteDialog()}>
            Cancel
          </Button>
          <Button onClick={() => closeCreateNoteDialog()}>Submit</Button>
          <small className='text-xs font-medium text-muted-foreground leading-none'>
            CTRL + Enter to save
          </small>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NoteCreateView
