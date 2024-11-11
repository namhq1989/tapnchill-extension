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
import { CalendarIcon } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import BackButton from '@/back-button.tsx'
import useGoalsStore from '@/modules/task/goals-store.ts'
import useTaskManipulationStore from '@/modules/task/task-manipulation-store.ts'

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
  goalId: z.string({
    required_error: 'Please select a goal',
  }),
  dueDate: z.date(),
})

const CreateTaskView = () => {
  const { goals } = useGoalsStore()
  const { createTask } = useTaskManipulationStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const isSuccess = await createTask(
      data.name,
      data.description,
      data.dueDate,
      data.goalId,
    )
    if (isSuccess) {
      form.reset()
    }
  }

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Add task' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
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
            <FormField
              control={form.control}
              name='goalId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a goal' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {goals.map((g) => {
                        return (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button>Add task</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateTaskView
