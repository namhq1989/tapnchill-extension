import { Goal } from 'lucide-react'
import { IGoal } from '@/modules/goal/types.ts'

interface IGoalPreviewItemViewProps {
  goal: IGoal
}

const GoalPreviewItemView = (props: IGoalPreviewItemViewProps) => {
  const { goal } = props

  let completedWidthPercent = 0
  let totalWidthPercent = 1
  let completedBarBorderStyles = 'rounded-tr-xl rounded-br-xl'
  let totalBarBorderStyles = 'rounded-tr-xl rounded-br-xl'

  if (goal.stats.totalTask > 0) {
    completedWidthPercent = goal.stats.totalDoneTask / goal.stats.totalTask
    totalWidthPercent = 1 - completedWidthPercent
  }

  if (totalWidthPercent === 1) {
    totalBarBorderStyles = 'rounded-xl'
  }

  if (completedWidthPercent === 1) {
    completedBarBorderStyles = 'rounded-xl'
  }

  return (
    <div className='flex flex-col gap-2 container-selected p-4 rounded-xl'>
      <div className='flex flex-row justify-between items-center'>
        <div className='flex flex-row gap-1 items-center'>
          <Goal size={16} strokeWidth={1} />
          <p className='text-xs'>{goal.name}</p>
        </div>
        <p className='text-xs'>
          {goal.stats.totalDoneTask}/{goal.stats.totalTask}
        </p>
      </div>
      <div className='flex flex-row'>
        <div
          className={`flex h-2 bg-primary ${completedBarBorderStyles}`}
          style={{
            width: `${Math.round(completedWidthPercent * 100)}%`,
          }}
        ></div>
        <div
          className={`flex h-2 bg-background ${totalBarBorderStyles}`}
          style={{
            width: `${Math.round(totalWidthPercent * 100)}%`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default GoalPreviewItemView
