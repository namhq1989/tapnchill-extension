import { Textarea } from '@/components/ui/textarea.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Button } from '@/components/ui/button.tsx'
import { z } from 'zod'
import { INote } from '@/modules/note/types.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { goBack } from 'react-chrome-extension-router'
import useNoteStore from '@/modules/note/store.ts'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useEffect } from 'react'
import { getDomain } from '@/lib/string.ts'

const SELECTED_TEXT_MAX_LENGTH = 150

export interface INoteCreateViewProps {
  note: INote | undefined
  pageText: string
  pageTitle: string
  pageUrl: string
}

const FormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: 'Note title must be at least 3 characters',
    })
    .max(50, {
      message: 'Note title must not be longer than 50 characters',
    }),
  description: z.string().max(300, {
    message: 'Note description must not be longer than 300 characters',
  }),
})

const NoteCreateView = (props: INoteCreateViewProps) => {
  const { note, pageText, pageTitle, pageUrl } = props
  const { createNote, updateNote } = useNoteStore()

  const isUpdating = note !== undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isUpdating && note) {
      form.setValue('title', note.title || '')
      form.setValue('description', note.description || '')
    }
  }, [isUpdating, note, form])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let isSuccess = false

    if (isUpdating) {
      note.title = data.title
      note.description = data.description
      isSuccess = await updateNote(note)
    } else {
      isSuccess = await createNote(
        data.title,
        data.description,
        pageUrl
          ? {
              pageText,
              pageTitle,
              pageUrl,
              pageDomain: getDomain(pageUrl),
            }
          : null,
      )
    }

    if (isSuccess) {
      form.reset()
      goBack()
    }
  }

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='New Note' />
      </div>
      <div className='flex flex-col p-4 gap-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col w-full gap-8'
          >
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
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className='focus-visible:ring-transparent resize-none'
                      placeholder='Input a description'
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {pageUrl && (
              <div className='flex flex-col gap-2 pl-4 border-l-4'>
                {pageTitle && (
                  <h4
                    className='scroll-m-20 text-base tracking-tight truncate max-w-xs'
                    title={pageTitle}
                  >
                    {pageTitle}
                  </h4>
                )}
                {pageText && (
                  <div className='text-sm border-l-2 p-4 italic whitespace-pre-line container-selected rounded-xl'>
                    {pageText.length > SELECTED_TEXT_MAX_LENGTH
                      ? pageText.slice(0, SELECTED_TEXT_MAX_LENGTH) + '...'
                      : pageText}
                  </div>
                )}
              </div>
            )}
            <Button>{isUpdating ? 'Update note' : 'Add note'}</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NoteCreateView
