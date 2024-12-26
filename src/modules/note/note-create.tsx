import { useTheme } from '@/components/theme/theme-provider.tsx'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { z } from 'zod'
import useNoteStore from '@/modules/note/store.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useCallback, useEffect, useRef, useState } from 'react'

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

const NoteCreateView = () => {
  const [hasEditing, setHasEditing] = useState(false)
  const cooldownRef = useRef(false) // To prevent spamming hotkey
  const {
    currentNote: note,
    createNote,
    updateNote,
    deleteNote,
  } = useNoteStore()
  const { theme } = useTheme()

  const isUpdating = note !== null

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

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (cooldownRef.current) return // Prevent spamming

      cooldownRef.current = true
      setTimeout(() => {
        cooldownRef.current = false // Reset cooldown after 2 seconds
      }, 2000)

      if (isUpdating) {
        note.title = data.title
        note.description = JSON.stringify(editor.document)
        await updateNote(note)
        setHasEditing(false)
      } else {
        await createNote(data.title, JSON.stringify(editor.document), null)
      }
    },
    [isUpdating, note, createNote, updateNote, editor],
  )

  // Handle hotkeys for Ctrl + S / Command + S
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        onSubmit(form.getValues()).then()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [form, onSubmit])

  // Auto-save every 10 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasEditing) {
        onSubmit(form.getValues()).then()
      }
    }, 10000)

    return () => {
      clearInterval(interval) // Cleanup interval on unmount
    }
  }, [hasEditing, form, onSubmit])

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
