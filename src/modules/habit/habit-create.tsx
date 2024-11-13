import BackButton from '@/back-button.tsx'
import HeaderTitle from '@/header-title.tsx'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import useAppStore from '@/store.ts'
import useHabitsStore from '@/modules/habit/store.ts'

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Activity name must be at least 3 characters',
    })
    .max(30, {
      message: 'Activity name must not be longer than 30 characters',
    }),
  target: z.string().max(50, {
    message: 'Keep the target as short as possible',
  }),
  weekdays: z.array(z.string()).nonempty({
    message: 'Please select at least one day',
  }),
  icon: z.string({
    required_error: 'Please select an icon',
  }),
})

const HabitCreateView = () => {
  const { weekdays } = useAppStore()
  const { icons } = useHabitsStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      target: '',
      weekdays: [],
      icon: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log('data', data)
  }

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Create activity' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col w-full gap-8'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-transparent'
                      placeholder='Activity name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='target'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-transparent'
                      placeholder='Activity target (30 minutes, 2000ml, 5 cups...)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='weekdays'
              render={() => (
                <FormItem>
                  <FormLabel>Weekdays</FormLabel>
                  <FormControl>
                    <div className='flex flex-row gap-2 justify-around'>
                      {weekdays.map((day) => (
                        <Controller
                          key={day.id}
                          name='weekdays'
                          control={form.control}
                          render={({ field }) => (
                            <div
                              className={`flex w-full h-8 text-muted-foreground rounded-sm items-center justify-center cursor-pointer ${
                                field.value.includes(day.id)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'ring-1 ring-muted-foreground'
                              }`}
                              onClick={() => {
                                const selectedDays =
                                  Array.isArray(field.value) &&
                                  field.value.includes(day.id)
                                    ? field.value.filter((d) => d !== day.id)
                                    : [
                                        ...(Array.isArray(field.value)
                                          ? field.value
                                          : []),
                                        day.id,
                                      ]
                                field.onChange(selectedDays)
                              }}
                            >
                              {day.name}
                            </div>
                          )}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select an Icon</FormLabel>
                  <FormControl>
                    <div className='grid grid-cols-4 gap-2'>
                      {icons.map((icon) => (
                        <div
                          key={icon.id}
                          onClick={() => field.onChange(icon.id)}
                          className={`w-20 h-20 cursor-pointer rounded-xl p-2 border ${
                            field.value === icon.id
                              ? 'border-primary'
                              : 'border-transparent'
                          }`}
                        >
                          <img
                            src={icon.url}
                            alt={`Icon ${icon.id}`}
                            className='w-full h-full rounded-full object-cover'
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4'>Add activity</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default HabitCreateView
