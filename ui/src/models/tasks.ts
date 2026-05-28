import type { Member, Task } from '../types'

const now = new Date()
const todayIso = now.toISOString().slice(0, 10)
const tomorrowIso = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
const inTwoDaysIso = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
const overdueIso = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

export const members: Member[] = [
  { _id: '1', name: 'samarth', displayName: 'Samarth', color: '#dbe3ff' },
  { _id: '2', name: 'ashray', displayName: 'Ashray', color: '#d8f0e1' },
  { _id: '3', name: 'sudhanshu', displayName: 'Sudhanshu', color: '#dfe8ff' },
  { _id: '4', name: 'arpan', displayName: 'Arpan', color: '#ffe3de' },
]

export const dashboardTasks: Task[] = [
  {
    _id: 'task-1',
    title: 'Kitchen Cleaning',
    description: 'Deep scrub counters and wipe down surfaces.',
    type: 'cleaning',
    owner: members[0],
    dueAt: todayIso,
  },
  {
    _id: 'task-2',
    title: 'Garbage Disposal',
    description: 'Take out kitchen waste and recycling.',
    type: 'garbage',
    owner: members[1],
    dueAt: tomorrowIso,
  },
  {
    _id: 'task-3',
    title: 'Living Room Vacuum',
    description: 'Vacuum rug and couch under cushions.',
    type: 'cleaning',
    owner: members[2],
    dueAt: inTwoDaysIso,
  },
  {
    _id: 'task-4',
    title: 'Bathroom Scrubbing',
    description: 'Scrub tiles, mirror, and toilet area.',
    type: 'cleaning',
    owner: members[3],
    dueAt: overdueIso,
  },
]

export const upcomingTasks: Task[] = [
  {
    _id: 'task-5',
    title: 'Groceries Run',
    description: 'Shared Duty',
    type: 'water',
    owner: members[0],
    dueAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  },
  {
    _id: 'task-6',
    title: 'Pay Electricity Bill',
    description: 'Samarth',
    type: 'water',
    owner: members[0],
    dueAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  },
  {
    _id: 'task-7',
    title: 'Deep Clean Fridge',
    description: 'Ashray',
    type: 'cleaning',
    owner: members[1],
    dueAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  },
]

export type ScheduleDay = {
  label: string
  date: string
  tasks: Task[]
}

export const scheduleDays: ScheduleDay[] = [
  {
    label: 'Mon',
    date: '16',
    tasks: [
      {
        _id: 'task-mon-1',
        title: 'Vacuum Living Room',
        description: 'Due: 8 PM',
        type: 'cleaning',
        owner: members[2],
        dueAt: todayIso,
      },
      {
        _id: 'task-mon-2',
        title: 'Take out Trash',
        description: 'Due: 9 AM',
        type: 'garbage',
        owner: members[0],
        dueAt: tomorrowIso,
      },
    ],
  },
  {
    label: 'Tue',
    date: '17',
    tasks: [
      {
        _id: 'task-tue-1',
        title: 'Buy Milk & Eggs',
        description: 'Anytime',
        type: 'water',
        owner: members[2],
        dueAt: tomorrowIso,
      },
    ],
  },
  {
    label: 'Wed',
    date: '18',
    tasks: [],
  },
  {
    label: 'Thu',
    date: '19',
    tasks: [
      {
        _id: 'task-thu-1',
        title: 'Clean Kitchen Counters',
        description: 'Done',
        type: 'cleaning',
        owner: members[3],
        dueAt: inTwoDaysIso,
      },
    ],
  },
  {
    label: 'Fri',
    date: '20',
    tasks: [],
  },
  {
    label: 'Sat',
    date: '21',
    tasks: [
      {
        _id: 'task-sat-1',
        title: 'Clean Bathrooms',
        description: 'High Priority',
        type: 'cleaning',
        owner: members[1],
        dueAt: overdueIso,
      },
    ],
  },
  {
    label: 'Sun',
    date: '22',
    tasks: [
      {
        _id: 'task-sun-1',
        title: 'Collect Internet Bill',
        description: 'Due: EOD',
        type: 'water',
        owner: members[2],
        dueAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      },
    ],
  },
]

export const flatmateFilters = ['All', 'Samarth', 'Ashray', 'Sudhanshu', 'Arpan']
export const categoryFilters = ['Cleaning', 'Groceries', 'Bills']
