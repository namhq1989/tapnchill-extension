import useTaskStore from '@/modules/task/store.ts'
import CreateTaskView from '@/modules/task/task-create.tsx'
import TaskView from '@/modules/task/view.tsx'
import TaskPreviewItem from '@/modules/task/task-preview-item.tsx'

const TaskPreview = () => {
  const { tasks, toggleTask } = useTaskStore()

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>Tasks</h2>
        <div className='flex flex-row gap-4'>
          <CreateTaskView />
          <TaskView />
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

export default TaskPreview
