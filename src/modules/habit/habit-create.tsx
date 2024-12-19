import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
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
import useAppStore from '@/modules/common/store.ts'
import useHabitsStore from '@/modules/habit/store.ts'
import { IHabit } from '@/modules/habit/types.ts'
import { goBack } from 'react-chrome-extension-router'
import { useEffect } from 'react'

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Activity name must be at least 3 characters',
    })
    .max(30, {
      message: 'Activity name must not be longer than 30 characters',
    }),
  goal: z
    .string()
    .min(3, {
      message: 'Activity goal must be at least 3 characters',
    })
    .max(50, {
      message: 'Keep the goal as short as possible',
    }),
  daysOfWeek: z.array(z.number()).nonempty({
    message: 'Please select at least one day',
  }),
  icon: z.string({
    required_error: 'Please select an icon',
  }),
  sortOrder: z.number().default(1),
})

interface IHabitCreateViewProps {
  habit: IHabit | undefined
}

const HabitCreateView = (props: IHabitCreateViewProps) => {
  const { habit } = props
  const { weekdays } = useAppStore()
  const { icons, createHabit, updateHabit } = useHabitsStore()

  const isUpdating = habit !== undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      goal: '',
      daysOfWeek: [],
      icon: '',
      sortOrder: 1,
    },
  })

  useEffect(() => {
    if (isUpdating && habit) {
      form.setValue('name', habit.name || '')
      form.setValue('goal', habit.goal || '')
      form.setValue(
        'daysOfWeek',
        (habit.daysOfWeek && habit.daysOfWeek.length > 0
          ? habit.daysOfWeek
          : [0]) as [number, ...number[]],
      )
      form.setValue('icon', habit.icon || '')
      form.setValue('sortOrder', habit.sortOrder || 1)
    }
  }, [isUpdating, habit, form])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let isSuccess = false

    if (isUpdating) {
      habit.name = data.name
      habit.goal = data.goal
      habit.daysOfWeek = data.daysOfWeek
      habit.icon = data.icon
      habit.sortOrder = data.sortOrder
      isSuccess = await updateHabit(habit)
    } else {
      isSuccess = await createHabit(
        data.name,
        data.goal,
        data.daysOfWeek,
        data.icon,
        data.sortOrder,
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
        <HeaderTitle title={isUpdating ? 'Edit Activity' : 'New Activity'} />
      </div>
      <div className='flex flex-col p-4 gap-4'>
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
              name='goal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-transparent'
                      placeholder='Activity goal (in 30 minutes, 2000ml, 5 cups...)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='daysOfWeek'
              render={() => (
                <FormItem>
                  <FormLabel>Days of week</FormLabel>
                  <FormControl>
                    <div className='flex flex-row gap-2 justify-around'>
                      {weekdays.map((day) => (
                        <Controller
                          key={day.id}
                          name='daysOfWeek'
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
            <FormField
              control={form.control}
              name='sortOrder'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-transparent'
                      placeholder='Sort ascending'
                      type='number'
                      {...field}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col m4-4 gap-4'>
              {/*{!isUpdating && (*/}
              {/*  <div className='flex flex-row gap-2'>*/}
              {/*    <Info strokeWidth={1} />*/}
              {/*    <span className='text-sm text-muted-foreground'>*/}
              {/*      New habits will be added to your daily schedule starting the*/}
              {/*      next day after creation*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*)}*/}
              <Button>{isUpdating ? 'Update activity' : 'Add activity'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default HabitCreateView
