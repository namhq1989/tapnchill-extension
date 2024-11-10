import { create } from 'zustand'
import { ITasksStore, TaskStatus } from '@/modules/task/types.ts'

const useTaskStore = create<ITasksStore>((set, get) => ({
  goals: [
    {
      id: '1',
      name: 'Programming',
      isCompleted: false,
      description: 'Learn the basics of programming',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Design',
      isCompleted: false,
      description: 'Learn the basics of design',
      createdAt: new Date(),
    },
  ],
  tasks: [
    {
      id: '1',
      goalId: '1',
      name: 'Create wireframe for Homepage',
      description:
        'Design a wireframe layout for the homepage based on client requirements',
      status: TaskStatus.todo,
      createdAt: new Date(),
      dueDate: new Date(new Date().getTime() + 60000 * 1540),
      completedAt: null,
    },
    {
      id: '2',
      goalId: '1',
      name: 'Develop user authentication',
      description:
        'Implement login and signup functionality with validation and error handling',
      status: TaskStatus.done,
      createdAt: new Date('2024-10-20T09:00:00Z'),
      dueDate: new Date(new Date().getTime() + 60000 * 30),
      completedAt: new Date(),
    },
    {
      id: '3',
      goalId: '1',
      name: 'Optimize image load times',
      description:
        'Reduce image file sizes and leverage lazy loading to improve page load speed',
      status: TaskStatus.todo,
      createdAt: new Date(),
      dueDate: null,
      completedAt: null,
    },
    {
      id: '4',
      goalId: '1',
      name: 'Complete project report',
      description:
        'Finish the final report and submit it to the project manager',
      status: TaskStatus.todo,
      createdAt: new Date('2024-10-20T09:00:00Z'),
      dueDate: new Date('2024-11-05T17:00:00Z'),
      completedAt: null,
    },
    {
      id: '5',
      goalId: '1',
      name: 'Prepare presentation slides',
      description: 'Create slides for the quarterly review meeting',
      status: TaskStatus.todo,
      createdAt: new Date('2024-10-20T09:00:00Z'),
      dueDate: new Date('2024-11-14T17:00:00Z'),
      completedAt: null,
    },
  ],
  toggleTask: (id: string) => {
    const { tasks } = get()
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    let newStatus = TaskStatus.todo
    if (task.status === TaskStatus.todo) {
      newStatus = TaskStatus.done
    }

    task.status = newStatus
    if (task.status === TaskStatus.done) {
      task.completedAt = new Date()
    }
    set({
      tasks: tasks.map((t) => (t.id === id ? task : t)),
    })
  },

  statusFilters: [
    { id: 'all', name: 'All' },
    { id: 'todo', name: 'Todo' },
    { id: 'done', name: 'Done' },
  ],
  selectedStatusFilterId: '',
  selectStatusFilter: (id: string) => {
    const { selectedStatusFilterId } = get()
    if (selectedStatusFilterId === id) return

    set({ selectedStatusFilterId: id })
    chrome.storage.local
      .set({
        taskSelectedStatusFilterId: id,
      })
      .then()
  },
}))

export default useTaskStore
