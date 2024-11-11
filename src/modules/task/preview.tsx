import useTaskStore from '@/modules/task/store.ts'
import CreateTaskView from '@/modules/task/task-create.tsx'
import TaskView from '@/modules/task/view.tsx'
import TaskPreviewItem from '@/modules/task/task-preview-item.tsx'
import { Link } from 'react-chrome-extension-router'
import { ListPlus, Plus } from 'lucide-react'

const TaskPreview = () => {
  const { tasks, toggleTask } = useTaskStore()

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>Tasks</h2>
        <div className='flex flex-row gap-4'>
          <Link component={CreateTaskView}>
            <Plus className='cursor-pointer' />
          </Link>
          <Link component={TaskView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {tasks.length === 0 && (
          <div className='flex flex-col gap-2 items-center py-4 mb-4'>
            <p className='text-sm text-muted-foreground'>
              Start your journey! Create your first task now!
            </p>
          </div>
        )}
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

export default TaskPreview
