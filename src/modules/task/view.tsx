import HeaderTitle from '@/header-title.tsx'
import TaskPreviewItem from '@/modules/task/task-preview-item.tsx'
import useTaskStore from '@/modules/task/store.ts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import BackButton from '@/back-button.tsx'

const TaskView = () => {
  const {
    tasks,
    toggleTask,
    statusFilters,
    selectedStatusFilterId,
    selectStatusFilter,
  } = useTaskStore()

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Tasks' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <div className='flex flex-row gap-4'>
          <Select
            defaultValue={selectedStatusFilterId}
            onValueChange={(id) => selectStatusFilter(id)}
          >
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='All' />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((f) => (
                <SelectItem key={`filter_${f.id}`} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    </div>
  )
}

export default TaskView
