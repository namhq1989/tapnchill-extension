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
import { CalendarIcon, Edit } from 'lucide-react'
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
import useTaskStore from '@/modules/task/store.ts'
import { useState } from 'react'
import useNotificationStore from '@/modules/notification/store.ts'

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

export interface IEditTaskViewProps {
  taskId: string
}

const EditTaskView = (props: IEditTaskViewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { showErrorNotification } = useNotificationStore()
  const { tasks, updateTask } = useTaskStore()
  const { taskId } = props

  const task = tasks.find((t) => t.id === taskId)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: task?.name || '',
      description: task?.description || '',
      dueDate: task?.dueDate || undefined,
    },
  })

  if (!task) {
    showErrorNotification({
      description: 'Task not found',
    })
    setIsOpen(false)
    return null
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const isSuccess = await updateTask(
      task.id,
      data.name,
      data.description,
      data.dueDate,
    )
    if (isSuccess) {
      form.reset()
      setIsOpen(false)
    }
  }

  return (
    <div className='flex cursor-pointer'>
      <Sheet
        key={side}
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (open && task) {
            form.reset({
              name: task.name,
              description: task.description,
              dueDate: task.dueDate || undefined,
            })
          }
        }}
      >
        <SheetTrigger asChild>
          <Button variant='secondary' className='w-full my-2'>
            <Edit /> Edit
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className='w-full overflow-auto p-0'>
          <SheetHeader className='p-4'>
            <SheetTitle>
              <HeaderTitle title='Edit task' />
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
                              <CalendarIcon className='h-4 w-4' />
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
                          rows={8}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>Update task</Button>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default EditTaskView
