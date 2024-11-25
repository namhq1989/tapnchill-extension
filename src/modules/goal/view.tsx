import useGoalsStore from '@/modules/goal/store.ts'
import GoalItem from '@/modules/goal/goal-item.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import HeaderTitle from '@/modules/common/header-title.tsx'
import { Plus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import GoalCreateView from '@/modules/goal/goal-create.tsx'

const GoalView = () => {
  const { goals, deleteGoal } = useGoalsStore()

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Goals' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <div className='flex flex-col w-full gap-4'>
          <div className='flex flex-col gap-4'>
            {goals.map((g) => {
              return (
                <GoalItem
                  key={`detail-goal-${g.id}`}
                  goal={g}
                  onDelete={async () => {
                    await deleteGoal(g)
                  }}
                />
              )
            })}
          </div>
        </div>

        <Link
          component={GoalCreateView}
          className='flex flex-row my-4 gap-2 justify-center items-center cursor-pointer'
        >
          <Plus />
          <p className='text-sm font-bold'>New Goal</p>
        </Link>
      </div>
    </div>
  )
}

export default GoalView
