import { ITask, TaskStatus } from '@/modules/task/types.ts'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { ChevronRight, Circle, CircleCheckBig, Edit, Goal } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import EditTaskView from '@/modules/task/task-edit.tsx'
import { useState } from 'react'
import TaskTimeView from '@/modules/task/task-time.tsx'
import { Link } from 'react-chrome-extension-router'
import useTaskManipulationStore from '@/modules/task/task-manipulation-store.ts'

const side = 'bottom'

export interface ITaskDetailProps {
  task: ITask
}

const TaskDetailView = (props: ITaskDetailProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { toggleTask } = useTaskManipulationStore()
  const { task } = props

  const isCompleted = task.status === TaskStatus.done

  return (
    <div className='flex cursor-pointer'>
      <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <ChevronRight strokeWidth={1} className='cursor-pointer' />
        </SheetTrigger>
        {isOpen && (
          <SheetContent
            side={side}
            className='w-full min-h-[250px] max-h-[90%] overflow-auto p-0 rounded-tl-xl rounded-tr-xl'
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader className='p-4'>
              <SheetTitle>
                <p className='text-base text-primary font-bold tracking-wide'>
                  Task information
                </p>
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-2 p-4'>
              <h3
                className={`scroll-m-20 text-xl font-semibold tracking-tight ${isCompleted ? 'line-through' : ''}`}
              >
                {task.name}
              </h3>
              <blockquote className='border-l-2 pl-4 leading-6 text-sm mb-4 whitespace-pre-line'>
                {task.description || '-'}
              </blockquote>
              <div className='flex flex-row gap-4 items-start'>
                {task.dueDate && (
                  <div className='flex flex-row gap-1 items-center'>
                    <TaskTimeView
                      isDetailView={true}
                      status={task.status}
                      dueDate={task.dueDate}
                      createdAt={task.createdAt}
                      completedAt={task.completedAt}
                    />
                  </div>
                )}
                {task.goal && (
                  <div className='flex flex-row gap-1 items-center'>
                    <Goal size={20} />
                    <p className='text-sm'>{task.goal.name}</p>
                  </div>
                )}
              </div>
              {isCompleted ? (
                <Button
                  variant='outline'
                  className='mt-8'
                  onClick={async () => await toggleTask(task)}
                >
                  <Circle /> Reopen Task
                </Button>
              ) : (
                <Button
                  className='mt-8'
                  onClick={async () => await toggleTask(task)}
                >
                  <CircleCheckBig /> Mark as Done
                </Button>
              )}

              <Link component={EditTaskView} props={{ task }}>
                <Button variant='secondary' className='w-full'>
                  <Edit /> Edit
                </Button>
              </Link>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}

export default TaskDetailView
