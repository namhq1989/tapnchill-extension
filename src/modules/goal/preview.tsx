import { Link } from 'react-chrome-extension-router'
import { ListPlus } from 'lucide-react'
import useGoalsStore from '@/modules/goal/store.ts'
import GoalPreviewItem from '@/modules/goal/goal-preview-item.tsx'
import GoalView from '@/modules/goal/view.tsx'

const GoalPreview = () => {
  const { goals } = useGoalsStore()

  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>Goals</h2>
        <div className='flex flex-row gap-4'>
          <Link component={GoalView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {goals.map((g) => {
          return <GoalPreviewItem key={`preview-goal-${g.id}`} goal={g} />
        })}
      </div>
    </div>
  )
}

export default GoalPreview
