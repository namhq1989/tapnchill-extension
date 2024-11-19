import { IHabitIcon } from '@/modules/habit/types.ts'

const getIconUrl = (name: string) => {
  return `${import.meta.env.VITE_CDN_ENDPOINT}/${name}`
}

const listHabitIcons: IHabitIcon[] = [
  {
    id: 'drink-water',
    url: getIconUrl('drink-water.png'),
  },
  {
    id: 'eating',
    url: getIconUrl('eating.png'),
  },
  {
    id: 'health-checkups',
    url: getIconUrl('health-checkups.png'),
  },
  {
    id: 'learning',
    url: getIconUrl('learning.png'),
  },
  {
    id: 'mindfulness',
    url: getIconUrl('mindfulness.png'),
  },
  {
    id: 'outdoor-activity',
    url: getIconUrl('outdoor-activity.png'),
  },
  {
    id: 'recycle-bin',
    url: getIconUrl('recycle-bin.png'),
  },
  {
    id: 'skin-protection',
    url: getIconUrl('skin-protection.png'),
  },
  {
    id: 'sleep-hygiene',
    url: getIconUrl('sleep-hygiene.png'),
  },
  {
    id: 'snack',
    url: getIconUrl('snack.png'),
  },
  {
    id: 'taking-exercise',
    url: getIconUrl('taking-exercise.png'),
  },
  {
    id: 'yoga',
    url: getIconUrl('yoga.png'),
  },
  {
    id: 'search',
    url: getIconUrl('search.png'),
  },
  {
    id: 'team',
    url: getIconUrl('team.png'),
  },
  {
    id: 'cooking',
    url: getIconUrl('cooking.png'),
  },
  {
    id: 'reading',
    url: getIconUrl('reading.png'),
  },
  {
    id: 'social-view',
    url: getIconUrl('social-view.png'),
  },
  {
    id: 'gaming',
    url: getIconUrl('gaming.png'),
  },
  {
    id: 'athlete',
    url: getIconUrl('athlete.png'),
  },
  {
    id: 'headphones',
    url: getIconUrl('headphones.png'),
  },
  {
    id: 'shower',
    url: getIconUrl('shower.png'),
  },
  {
    id: 'swimming',
    url: getIconUrl('swimming.png'),
  },
]

export default listHabitIcons
