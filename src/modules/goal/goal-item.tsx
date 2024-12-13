import { Goal, Settings, Trash2 } from 'lucide-react'
import { IGoal } from '@/modules/goal/types.ts'
import { Link } from 'react-chrome-extension-router'
import GoalCreateView from '@/modules/goal/goal-create.tsx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'

interface IGoalItemViewProps {
  goal: IGoal
  onDelete: () => void
}

const GoalItemView = (props: IGoalItemViewProps) => {
  const { goal, onDelete } = props

  let completedWidthPercent = 0
  let totalWidthPercent = 1
  let completedBarBorderStyles = 'rounded-tr-xl rounded-br-xl'
  let totalBarBorderStyles = 'rounded-tr-xl rounded-br-xl'

  if (goal.stats.totalTask > 0) {
    completedWidthPercent = goal.stats.totalDoneTask / goal.stats.totalTask
    totalWidthPercent = 1 - completedWidthPercent
  }

  if (totalWidthPercent === 1) {
    totalBarBorderStyles = 'rounded-xl'
  } else if (completedWidthPercent === 1) {
    completedBarBorderStyles = 'rounded-xl'
  }

  return (
    <div className='flex flex-col gap-8 container-selected p-4 pb-8 rounded-xl'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row gap-1 items-center'>
            <Goal size={20} strokeWidth={1} />
            <p className='text-base'>{goal.name}</p>
          </div>
          <div className='flex flex-row gap-4'>
            <DeleteGoalAlert onConfirm={() => onDelete()} />
            <Link component={GoalCreateView} props={{ goal }}>
              <Settings size={16} strokeWidth={1} className='cursor-pointer' />
            </Link>
          </div>
        </div>
        <p className='text-sm text-muted-foreground whitespace-pre-line'>
          {goal.description}
        </p>
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row justify-between'>
          <p className='text-sm text-muted-foreground'>Completed tasks</p>
          <p className='text-sm text-primary'>{goal.stats.totalDoneTask}</p>
        </div>
        <div className='flex flex-row justify-between'>
          <p className='text-sm text-muted-foreground'>Total tasks</p>
          <p className='text-sm text-primary'>{goal.stats.totalTask}</p>
        </div>
        <div className='flex flex-row mt-4'>
          <div
            className={`flex h-2 bg-primary ${completedBarBorderStyles}`}
            style={{
              width: `${Math.round(completedWidthPercent * 100)}%`,
            }}
          ></div>
          <div
            className={`flex h-2 bg-background ${totalBarBorderStyles}`}
            style={{
              width: `${Math.round(totalWidthPercent * 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface IDeleteGoalAlertProps {
  onConfirm: () => void
}

const DeleteGoalAlert = (props: IDeleteGoalAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 size={16} strokeWidth={1} className='cursor-pointer' />
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-xl'>
        <AlertDialogHeader>
          <AlertDialogTitle />
          <AlertDialogDescription>
            Are you sure you want to delete this goal? This action cannot be
            undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              props.onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default GoalItemView
