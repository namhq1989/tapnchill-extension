import { create } from 'zustand'
import {
  IChangeTaskStatusApiRequest,
  IChangeTaskStatusApiResponse,
  ICreateTaskApiRequest,
  ICreateTaskApiResponse,
  ITask,
  ITaskManipulationStore,
  IUpdateTaskApiRequest,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import useGoalsStore from '@/modules/task/goals-store.ts'
import useTodoTasksStore from '@/modules/task/todo-tasks-store.ts'
import useListTasksStore from '@/modules/task/list-tasks-store.ts'

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

      // update task in store
      const { tasks: todoTasks } = useTodoTasksStore.getState()
      const { tasks: listTasks } = useListTasksStore.getState()
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

      todoTasks.unshift(newTask)
      useTodoTasksStore.setState({ tasks: todoTasks })

      listTasks.unshift(newTask)
      useListTasksStore.setState({ tasks: listTasks })

      chrome.storage.local
        .set({
          todoTasks: JSON.stringify(todoTasks),
          listTasks: JSON.stringify(listTasks),
        })
        .then()

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })
      return false
    }
  },
  updateTask: async (id, name, description, dueDate): Promise<boolean> => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<ICreateTaskApiResponse>(`api/task/${id}`, {
        name,
        description,
        dueDate,
      } as IUpdateTaskApiRequest)

      showNotification({
        description: 'Task updated successfully',
      })

      const { tasks: listTasks } = useListTasksStore.getState()

      const task = listTasks.find((t) => t.id === id)
      if (!task) return false

      const newTaskData: ITask = {
        ...task,
        name,
        description,
        dueDate,
      }

      updateTaskAndPersistTasksToLocalStorage(newTaskData)
      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },
  toggleTask: async (id: string) => {
    const { patch: httpPatch } = useHttpStore.getState()
    const { tasks: listTasks } = useListTasksStore.getState()

    const task = listTasks.find((t) => t.id === id)
    if (!task) return

    let newStatus = TaskStatus.todo
    if (task.status === TaskStatus.todo) {
      newStatus = TaskStatus.done
    }

    try {
      await httpPatch<IChangeTaskStatusApiResponse>(`api/task/${id}/status`, {
        status: newStatus,
      } as IChangeTaskStatusApiRequest)

      const newTaskData: ITask = {
        ...task,
        status: newStatus,
        completedAt: new Date(),
      }

      updateTaskAndPersistTasksToLocalStorage(newTaskData)
    } catch (err) {
      console.log('err', err)
    }
  },
}))

const updateTaskAndPersistTasksToLocalStorage = (newTaskData: ITask) => {
  const { tasks: todoTasks } = useTodoTasksStore.getState()
  const { tasks: listTasks } = useListTasksStore.getState()

  const todoIndex = todoTasks.findIndex((t) => t.id === newTaskData.id)
  if (todoIndex !== -1) {
    todoTasks[todoIndex] = newTaskData
    useTodoTasksStore.setState({ tasks: todoTasks })
  }

  const listIndex = listTasks.findIndex((t) => t.id === newTaskData.id)
  if (listIndex !== -1) {
    listTasks[listIndex] = newTaskData
    useListTasksStore.setState({ tasks: todoTasks })
  }

  chrome.storage.local
    .set({
      todoTasks: JSON.stringify(todoTasks),
      listTasks: JSON.stringify(listTasks),
    })
    .then()
}

export default useTaskManipulationStore
