import { useTheme } from '@/components/theme/theme-provider.tsx'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { z } from 'zod'
import { INote } from '@/modules/note/types.ts'
import useNoteStore from '@/modules/note/store.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { goBack } from 'react-chrome-extension-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import BackButton from '@/modules/common/back-button.tsx'

const defaultContent = Array(20).fill({
  type: 'paragraph',
})

const FormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Note title must be at least 3 characters',
    })
    .max(50, {
      message: 'Note title must not be longer than 50 characters',
    }),
})

export interface INoteCreateViewProps {
  note: INote | undefined
}

const NoteCreateView = (props: INoteCreateViewProps) => {
  const [hasEditing, setHasEditing] = useState(false)
  const { note } = props
  const { createNote, updateNote, deleteNote } = useNoteStore()
  const { theme } = useTheme()

  const isUpdating = note !== undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: 'Untitled',
    },
  })

  useEffect(() => {
    if (isUpdating && note) {
      form.setValue('title', note.title || '')
    }
  }, [isUpdating, note, form])

  const editor = useCreateBlockNote({
    initialContent: note ? JSON.parse(note.description) : defaultContent,
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isUpdating) {
      note.title = data.title
      note.description = JSON.stringify(editor.document)
      await updateNote(note)
    } else {
      await createNote(data.title, JSON.stringify(editor.document), null)
    }
  }

  return (
    <div className='flex flex-col scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 pr-6 border-b-[1px]'>
        {isUpdating && hasEditing ? (
          <BackAlert
            onConfirm={() => {
              goBack()
            }}
          />
        ) : (
          <BackButton />
        )}
        <Save
          className='cursor-pointer text-primary'
          onClick={() => onSubmit(form.getValues())}
        />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <Form {...form}>
          <form className='flex flex-col w-full gap-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-transparent'
                      placeholder='Note title'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <BlockNoteView
              data-font-app
              data-theming
              editor={editor}
              theme={theme === 'dark' ? 'dark' : 'light'}
              onChange={() => {
                if (!hasEditing) {
                  setHasEditing(true)
                }
              }}
            />
            {isUpdating && (
              <DeleteNoteAlert
                onConfirm={async () => {
                  await deleteNote(note)
                  goBack()
                }}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

interface IBackAlertProps {
  onConfirm: () => void
}

const BackAlert = (props: IBackAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ArrowLeft className='cursor-pointer' />
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle />
          <AlertDialogDescription>
            You have unsaved changes in your note. Do you want to discard them
            and go back?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface IDeleteNoteAlertProps {
  onConfirm: () => void
}

const DeleteNoteAlert = (props: IDeleteNoteAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='w-full'>
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle />
          <AlertDialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default NoteCreateView
