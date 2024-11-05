import { create } from 'zustand'
import { ITasksStore } from '@/modules/task/types.ts'

const useTaskStore = create<ITasksStore>((set, get) => ({
  goals: [],
  tasks: [
    {
      id: '1',
      goalId: '1',
      name: 'Create wireframe for Homepage',
      description:
        'Design a wireframe layout for the homepage based on client requirements',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: new Date(new Date().getTime() + 60000 * 540),
      completedAt: null,
    },
    {
      id: '2',
      goalId: '1',
      name: 'Develop user authentication',
      description:
        'Implement login and signup functionality with validation and error handling',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: new Date(new Date().getTime() + 60000 * 30),
      completedAt: null,
    },
    {
      id: '3',
      goalId: '1',
      name: 'Optimize image load times',
      description:
        'Reduce image file sizes and leverage lazy loading to improve page load speed',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: null,
      completedAt: null,
    },
  ],
  toggleTask: (id: string) => {
    const { tasks } = get()
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    task.isCompleted = !task.isCompleted
    if (task.isCompleted) {
      task.completedAt = new Date()
    }
    set({
      tasks: tasks.map((t) => (t.id === id ? task : t)),
    })
  },
}))

export default useTaskStore
