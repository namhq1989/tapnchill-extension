import { create } from 'zustand'
import {
  IChangeTaskStatusApiRequest,
  IChangeTaskStatusApiResponse,
  ICreateTaskApiRequest,
  ICreateTaskApiResponse,
  ITask,
  ITaskManipulationStore,
  IUpdateTaskApiRequest,
  IUpdateTaskApiResponse,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import useTodoTasksStore from '@/modules/task/todo-tasks-store.ts'
import useListTasksStore from '@/modules/task/list-tasks-store.ts'
import useGoalsStore from '@/modules/goal/store.ts'

const useTaskManipulationStore = create<ITaskManipulationStore>(() => ({
  createTask: async (name, description, dueDate, goalId): Promise<boolean> => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateTaskApiResponse>('api/task', {
        name,
        description,
        dueDate,
        goalId,
      } as ICreateTaskApiRequest)

      showNotification({
        description: 'Task created successfully',
      })

      const { goals } = useGoalsStore.getState()
      const goal = goals.find((g) => g.id === goalId)

      const newTask = {
        id: response.id,
        goalId,
        goal: goal || null,
        name,
        description,
        status: TaskStatus.todo,
        createdAt: new Date(),
        dueDate,
        completedAt: null,
      }

      const { tasks: todoTasks } = useTodoTasksStore.getState()
      todoTasks.unshift(newTask)
      useTodoTasksStore.setState({
        tasks: todoTasks,
      })

      const {
        tasks: listTasks,
        selectedStatusFilterId,
        hasFetched,
      } = useListTasksStore.getState()
      if (hasFetched && selectedStatusFilterId !== TaskStatus.done) {
        listTasks.unshift(newTask)
        useListTasksStore.setState({
          tasks: listTasks,
        })
      }

      if (goal) {
        goal.stats.totalTask++
        useGoalsStore.setState({
          goals: goals.map((g) => (g.id === goalId ? goal : g)),
        })
      }

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })
      return false
    }
  },
  updateTask: async (task: ITask): Promise<boolean> => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<IUpdateTaskApiResponse>(`api/task/${task.id}`, {
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
      } as IUpdateTaskApiRequest)

      showNotification({
        description: 'Task updated successfully',
      })

      const { tasks: todoTasks } = useTodoTasksStore.getState()
      useTodoTasksStore.setState({
        tasks: todoTasks.map((t) => (t.id === task.id ? task : t)),
      })

      const { tasks: listTasks } = useListTasksStore.getState()
      useListTasksStore.setState({
        tasks: listTasks.map((t) => (t.id === task.id ? task : t)),
      })

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },
  deleteTask: async (task: ITask): Promise<boolean> => {
    const { delete: httpDelete } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpDelete<IUpdateTaskApiResponse>(`api/task/${task.id}`, {})

      showNotification({
        description: 'Task deleted successfully',
      })

      const { tasks: todoTasks } = useTodoTasksStore.getState()
      useTodoTasksStore.setState({
        tasks: todoTasks.filter((t) => t.id !== task.id),
      })

      const { tasks: listTasks } = useListTasksStore.getState()
      useListTasksStore.setState({
        tasks: listTasks.filter((t) => t.id !== task.id),
      })

      const { goals } = useGoalsStore.getState()
      const goal = goals.find((g) => g.id === task.goalId)
      if (goal) {
        goal.stats.totalTask -= 1
        if (task.status === TaskStatus.done) {
          goal.stats.totalDoneTask -= 1
        }

        useGoalsStore.setState({
          goals: goals.map((g) => (g.id === goal.id ? goal : g)),
        })
      }

      return true
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })

      return false
    }
  },
  toggleTask: async (task: ITask): Promise<void> => {
    const { patch: httpPatch } = useHttpStore.getState()
    const { showErrorNotification } = useNotificationStore.getState()

    if (task.status === TaskStatus.todo) {
      task.status = TaskStatus.done
    } else {
      task.status = TaskStatus.todo
    }

    try {
      await httpPatch<IChangeTaskStatusApiResponse>(
        `api/task/${task.id}/status`,
        {
          status: task.status,
        } as IChangeTaskStatusApiRequest,
      )

      const isStatusDone = task.status === TaskStatus.done

      if (isStatusDone) {
        task.completedAt = new Date()
      }

      const { tasks: todoTasks } = useTodoTasksStore.getState()
      useTodoTasksStore.setState({
        tasks: todoTasks.map((t) => (t.id === task.id ? task : t)),
      })

      const { tasks: listTasks } = useListTasksStore.getState()
      useListTasksStore.setState({
        tasks: listTasks.map((t) => (t.id === task.id ? task : t)),
      })

      const { goals } = useGoalsStore.getState()
      const goal = goals.find((g) => g.id === task.goalId)
      if (goal) {
        goal.stats.totalDoneTask += isStatusDone ? 1 : -1
        useGoalsStore.setState({
          goals: goals.map((g) => (g.id === goal.id ? goal : g)),
        })
      }
    } catch (err) {
      showErrorNotification({
        description: (err as Error).message,
      })
    }
  },
}))

export default useTaskManipulationStore
