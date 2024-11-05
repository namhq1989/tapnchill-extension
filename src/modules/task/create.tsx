import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { CalendarIcon, Plus } from 'lucide-react'
import HeaderTitle from '@/header-title.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import { cn } from '@/lib/utils.ts'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar.tsx'
import { TimePickerDemo } from '@/components/ui/timer-picker.tsx'

const side = 'right'

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Task name must be at least 3 characters',
    })
    .max(100, {
      message: 'Task name must not be longer than 100 characters',
    }),
  description: z.string().max(300, {
    message: 'Task description must not be longer than 300 characters',
  }),
  dueDate: z.date(),
})

const CreateTaskView = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log('data', data)
    // const success = await sendFeedback({
    //   email: data.email || '',
    //   feedback: data.feedback,
    // })
    // if (success) {
    //   form.reset()
    // }
  }

  return (
    <div className='flex cursor-pointer'>
      <Sheet
        key={side}
        onOpenChange={() => {
          form.reset()
        }}
      >
        <SheetTrigger asChild>
          <Plus className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>
              <HeaderTitle title='Add task' />
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col w-full p-4 gap-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col w-full gap-4'
              >
                <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel className='text-left'>Due date</FormLabel>
                      <Popover modal={true}>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'justify-start text-left font-normal focus-visible:ring-transparent',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy, HH:mm')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className='w-full p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            // initialFocus
                          />
                          <div className='p-3 border-t border-border'>
                            <TimePickerDemo
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          className='focus-visible:ring-transparent'
                          placeholder='What is the task?'
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
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className='font-bold'
                  onClick={() => onSubmit(form.getValues())}
                >
                  Add
                </Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default CreateTaskView
