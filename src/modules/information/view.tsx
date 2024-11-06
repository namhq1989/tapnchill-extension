import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { Info } from 'lucide-react'
import { z } from 'zod'
import useInformationStore from '@/modules/information/store.ts'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Textarea } from '@/components/ui/textarea.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import HeaderTitle from '@/header-title.tsx'

const side = 'right'

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address',
    })
    .optional()
    .or(z.literal('')),
  feedback: z
    .string({
      required_error: 'Feedback is required',
    })
    .min(5, {
      message: 'Feedback must be at least 5 characters',
    })
    .max(300, {
      message: 'Feedback must not be longer than 300 characters',
    }),
})

const InformationView = () => {
  const { isFeedbackSending, sendFeedback } = useInformationStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      feedback: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const success = await sendFeedback({
      email: data.email || '',
      feedback: data.feedback,
    })
    if (success) {
      form.reset()
    }
  }

  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <Info size={20} className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>
              <HeaderTitle title='Information' />
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col w-full p-4 gap-4'>
            <p className='text-sm'>
              tapnchill - Discover chilling music, long listening music, and
              relaxing playlists with tapnchill's 24/7 live streaming station.
              Tune in and chill out!
            </p>
            <p className='text-sm'>
              Goes beyond music, offering task management tools to help you stay
              organized and focused. Keep track of to-dos, set reminders, and
              prioritize goals—all while enjoying relaxing tunes.
            </p>
            <p className='text-sm'>
              Capture ideas and jot down notes effortlessly within the app,
              seamlessly blending music and productivity. Tapnchill is the
              perfect companion for both work and relaxation.
            </p>

            <Separator />
            <div className='flex flex-col justify-start items-start gap-2'>
              <p className='text-lg font-bold'>We appreciate you being here!</p>
              <p className='mb-4 text-sm'>
                Got feedback or a feature request? Let us know and help us
                improve!
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='flex flex-col w-full gap-4'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className='rounded-xl focus-visible:ring-transparent'
                            placeholder='Email (optional)'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='feedback'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className='rounded-xl focus-visible:ring-transparent resize-none'
                            placeholder='Type your feedback here'
                            rows={8}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className='font-bold'
                    disabled={isFeedbackSending}
                    // onClick={() => onSubmit(form.getValues())}
                  >
                    Send feedback
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default InformationView
