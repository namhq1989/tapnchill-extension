import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { ListPlus } from 'lucide-react'
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

const side = 'right'

const TaskView = () => {
  const {
    tasks,
    toggleTask,
    statusFilters,
    selectedStatusFilterId,
    selectStatusFilter,
  } = useTaskStore()

  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side}>
        <SheetTrigger asChild>
          <ListPlus className='cursor-pointer'></ListPlus>
        </SheetTrigger>
        <SheetContent
          side={side}
          className='w-full overflow-auto p-0'
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className='p-4'>
            <SheetTitle>
              <HeaderTitle title='Tasks' />
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-4 p-4'>
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
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default TaskView
