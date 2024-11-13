import CreateTaskView from '@/modules/task/task-create.tsx'
import TaskView from '@/modules/task/view.tsx'
import TaskPreviewItem from '@/modules/task/task-preview-item.tsx'
import { Link } from 'react-chrome-extension-router'
import { ListPlus, Plus } from 'lucide-react'
import useTodoTasksStore from '@/modules/task/todo-tasks-store.ts'
import useTaskManipulationStore from '@/modules/task/task-manipulation-store.ts'

const TaskPreview = () => {
  const { tasks } = useTodoTasksStore()
  const { toggleTask } = useTaskManipulationStore()

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>TO-DO Tasks</h2>
        <div className='flex flex-row gap-4'>
          <Link component={CreateTaskView}>
            <Plus className='cursor-pointer' />
          </Link>
          <Link component={TaskView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {tasks.length === 0 && (
          <div className='flex flex-col gap-2 items-center py-4 mb-4'>
            <p className='text-sm text-muted-foreground'>
              You don't have any TODO tasks yet!
            </p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskPreviewItem
            key={task.id}
            task={task}
            onToggleTask={async () => {
              await toggleTask(task)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskPreview
