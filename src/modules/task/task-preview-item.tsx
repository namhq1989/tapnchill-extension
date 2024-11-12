import { ITask, TaskStatus } from '@/modules/task/types.ts'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { Goal } from 'lucide-react'
import TaskDetailView from '@/modules/task/task-detail.tsx'
import TaskTimeView from '@/modules/task/task-time.tsx'

interface ITaskPreviewItemProps {
  task: ITask
  onToggleTask: () => void
}

const TaskPreviewItem = (props: ITaskPreviewItemProps) => {
  const { task, onToggleTask } = props
  const isCompleted = task.status === TaskStatus.done

  return (
    <div className='flex flex-row gap-4 rounded-xl container-selected p-4 items-center'>
      <Checkbox
        id={task.id}
        onCheckedChange={() => onToggleTask()}
        checked={isCompleted}
      />
      <div className='flex flex-col flex-grow gap-2'>
        <p
          className={`text-sm font-medium cursor-pointer leading-tight ${isCompleted ? 'line-through' : ''}`}
        >
          {task.name}
        </p>
        <div className='flex flex-row gap-4 items-center'>
          <TaskTimeView
            isDetailView={false}
            status={task.status}
            dueDate={task.dueDate}
            createdAt={task.createdAt}
            completedAt={task.completedAt}
          />
          {task.goal && (
            <div className='flex flex-row gap-1 items-center'>
              <Goal size={16} strokeWidth={1} />
              <p className='text-xs text-muted-foreground'>{task.goal.name}</p>
            </div>
          )}
        </div>
      </div>
      <TaskDetailView task={task} />
    </div>
  )
}

export default TaskPreviewItem
