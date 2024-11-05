import { ChevronRight, Goal, ListPlus, Timer } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import useTaskStore from '@/modules/task/task.ts'
import { ITask } from '@/modules/task/types.ts'
import CreateTaskView from '@/modules/task/create.tsx'

const TaskPreview = () => {
  const { tasks, toggleTask } = useTaskStore()

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>Tasks</h2>
        <div className='flex flex-row gap-4'>
          <CreateTaskView />
          <ListPlus className='cursor-pointer'></ListPlus>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {tasks.map((task) => (
          <TaskPreviewItem
            key={task.id}
            task={task}
            onToggleTask={() => {
              toggleTask(task.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface ITaskPreviewItemProps {
  task: ITask
  onToggleTask: () => void
}

const TaskPreviewItem = (props: ITaskPreviewItemProps) => {
  const { task, onToggleTask } = props
  return (
    <div className='flex flex-row gap-4 rounded-xl container-selected p-4 items-center'>
      <Checkbox
        id={task.id}
        onCheckedChange={() => onToggleTask()}
        checked={task.isCompleted}
      />
      <div className='flex flex-col flex-grow gap-2'>
        <label
          htmlFor={task.id}
          className={`text-sm font-medium leading-tight ${task.isCompleted ? 'line-through' : ''}`}
        >
          {task.name}
        </label>
        <div className='flex flex-row gap-4 items-center'>
          {task.dueDate && (
            <div className='flex flex-row gap-1 items-center'>
              <Timer size={16} strokeWidth={1} />
              <p className='text-xs text-muted-foreground'>
                {formatDate(task.dueDate)}
              </p>
            </div>
          )}
          <div className='flex flex-row gap-1 items-center'>
            <Goal size={16} strokeWidth={1} />
            <p className='text-xs text-muted-foreground'>Programming</p>
          </div>
        </div>
      </div>
      <ChevronRight strokeWidth={1} className='cursor-pointer' />
    </div>
  )
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export default TaskPreview
