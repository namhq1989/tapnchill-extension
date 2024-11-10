import { TaskStatus } from '@/modules/task/types.ts'
import { getRemainingTime, getTotalTimeTaken } from '@/lib/date.ts'
import { CircleCheckBig, Timer } from 'lucide-react'
import { getColorClass } from '@/lib/color.ts'

export interface ITaskTimeViewProps {
  isDetailView: boolean
  status: TaskStatus
  createdAt: Date
  dueDate: Date | null
  completedAt: Date | null
}

const TaskTimeView = (props: ITaskTimeViewProps) => {
  const { isDetailView, status, createdAt, dueDate, completedAt } = props
  const isCompleted = status === TaskStatus.done

  let TimeComponent
  if (isCompleted) {
    const totalTimeTaken = getTotalTimeTaken(createdAt, completedAt)
    if (totalTimeTaken) {
      TimeComponent = (
        <div className='flex flex-row gap-1 items-center'>
          <CircleCheckBig
            size={isDetailView ? 20 : 16}
            strokeWidth={isDetailView ? 2 : 1}
            className='text-green-600'
          />
          <p
            className={`${isDetailView ? 'text-sm' : 'text-xs'} text-green-600`}
          >
            {totalTimeTaken}
          </p>
        </div>
      )
    }
  } else if (dueDate) {
    const { remainingTime, color: remainingTimeColor } =
      getRemainingTime(dueDate)

    TimeComponent = (
      <div className='flex flex-row gap-1 items-center'>
        <Timer
          size={isDetailView ? 20 : 16}
          strokeWidth={isDetailView ? 2 : 1}
          className={getColorClass(
            remainingTimeColor,
            'text',
            isDetailView ? 'text-foreground' : 'text-muted-foreground',
          )}
        />
        <p
          className={`${isDetailView ? 'text-sm' : 'text-xs'} ${getColorClass(remainingTimeColor, 'text', isDetailView ? 'text-foreground' : 'text-muted-foreground')}`}
        >
          {remainingTime}
        </p>
      </div>
    )
  }

  return TimeComponent
}

export default TaskTimeView
