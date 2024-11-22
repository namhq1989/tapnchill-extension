import HeaderTitle from '@/modules/common/header-title.tsx'
import TaskPreviewItem from '@/modules/task/task-preview-item.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import BackButton from '@/modules/common/back-button.tsx'
import useListTasksStore from '@/modules/task/list-tasks-store.ts'
import { useEffect } from 'react'
import useTaskManipulationStore from '@/modules/task/task-manipulation-store.ts'
import { Plus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import CreateTaskView from '@/modules/task/task-create.tsx'
import GoalPreview from '@/modules/goal/preview.tsx'
import useGoalsStore from '@/modules/goal/store.ts'

const TaskView = () => {
  const {
    tasks,
    init,
    statusFilters,
    selectedStatusFilterId,
    selectStatusFilter,
    selectedGoalId,
    selectGoalFilter,
  } = useListTasksStore()
  const { goals } = useGoalsStore()
  const { toggleTask } = useTaskManipulationStore()

  const goalsFilter = [
    {
      id: 'all',
      name: 'All',
      description: '',
      createdAt: new Date(),
      isCompleted: false,
      stats: {
        totalCompletedTask: 0,
        totalTask: 0,
      },
    },
    ...goals,
  ]

  useEffect(() => {
    const fetch = async () => {
      await init()
    }

    fetch().then()
  }, [init, goals])

  return (
    <div className='flex flex-col w-[400px] min-h-[600px] scrollbar-hide'>
      <div className='flex w-full flex-row justify-between p-4 border-b-[1px]'>
        <BackButton />
        <HeaderTitle title='Tasks' />
      </div>
      <div className='flex flex-col p-4 gap-4 scrollbar-hide'>
        <GoalPreview />
        <div className='flex flex-row gap-4 justify-between items-center mt-8'>
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
                  <SelectItem key={`filter_status_${f.id}`} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              defaultValue={selectedGoalId}
              onValueChange={(id) => selectGoalFilter(id)}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='All' />
              </SelectTrigger>
              <SelectContent>
                {goalsFilter.map((g) => (
                  <SelectItem key={`filter_goal_${g.id}`} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Link component={CreateTaskView}>
            <Plus className='cursor-pointer' />
          </Link>
        </div>
        <div className='flex flex-col gap-2'>
          {tasks.map((task) => (
            <TaskPreviewItem
              key={`detail-task-${task.id}`}
              task={task}
              onToggleTask={async () => {
                await toggleTask(task)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskView
