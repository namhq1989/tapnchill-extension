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
import HeaderTitle from '@/modules/common/header-title.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import useGoalsStore from '@/modules/goal/store.ts'
import { IGoal } from '@/modules/goal/types.ts'
import { useEffect } from 'react'
import { goBack } from 'react-chrome-extension-router'

const FormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Goal name must be at least 3 characters',
    })
    .max(100, {
      message: 'Goal name must not be longer than 100 characters',
    }),
  description: z
    .string()
    .min(3, {
      message: 'Goal description must be at least 3 characters',
    })
    .max(200, {
      message: 'Goal description must not be longer than 200 characters',
    }),
})

interface IGoalCreateViewProps {
  goal: IGoal | undefined
}

const GoalCreateView = (props: IGoalCreateViewProps) => {
  const { goal } = props
  const { createGoal, updateGoal } = useGoalsStore()
  const isUpdating = goal !== undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  useEffect(() => {
    if (isUpdating && goal) {
      form.setValue('name', goal.name || '')
      form.setValue('description', goal.description || '')
    }
  }, [isUpdating, goal, form])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (isUpdating) {
      goal.name = data.name
      goal.description = data.description
      const isSuccess = await updateGoal(goal)
      if (isSuccess) {
        form.reset()
        goBack()
      }
    } else {
      const isSuccess = await createGoal(data.name, data.description)
      if (isSuccess) {
        form.reset()
      }
    }
  }

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title={isUpdating ? 'Update Goal' : 'New Goal'} />
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
                      placeholder='Goal name'
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
            <Button>{isUpdating ? 'Update goal' : 'Add goal'}</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default GoalCreateView
