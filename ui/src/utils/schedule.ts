import type { Task } from '../types'

export type ScheduleCategoryFilter =
  | 'All'
  | 'cleaning'
  | 'garbage'
  | 'water'
  | 'groceries'
  | 'bills'

export const SCHEDULE_CATEGORY_FILTERS: {
  id: ScheduleCategoryFilter
  label: string
  icon: string
}[] = [
  { id: 'All', label: 'All', icon: 'apps' },
  { id: 'cleaning', label: 'Cleaning', icon: 'mop' },
  { id: 'garbage', label: 'Garbage', icon: 'delete' },
  { id: 'water', label: 'Water', icon: 'water_drop' },
  { id: 'groceries', label: 'Groceries', icon: 'shopping_cart' },
  { id: 'bills', label: 'Bills', icon: 'receipt' },
]

/** Normalizes task type/category for schedule filter chips. */
export function getTaskCategoryKey(
  task: Task,
): Exclude<ScheduleCategoryFilter, 'All'> {
  if (task.category) {
    if (task.category === 'trash') return 'garbage'
    if (task.category === 'water_motor') return 'water'
    return task.category
  }
  if (task.type === 'garbage') return 'garbage'
  return task.type
}

export function filterScheduleTasks(
  tasks: Task[],
  flatmate: string,
  category: ScheduleCategoryFilter,
): Task[] {
  return tasks.filter((task) => {
    if (flatmate !== 'All' && task.owner.displayName !== flatmate) {
      return false
    }
    if (category !== 'All' && getTaskCategoryKey(task) !== category) {
      return false
    }
    return true
  })
}

export type ScheduleDay = {
  label: string
  date: string
  isoDate: string
  isToday: boolean
  tasks: Task[]
}

const PLANNER_DAY_COUNT = 7

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function toLocalIsoDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Range label for the rolling planner: today → today + 6 days. */
export function formatPlannerRange(reference = new Date()) {
  const start = startOfDay(reference)
  const end = addDays(start, PLANNER_DAY_COUNT - 1)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} - ${fmt(end)}, ${end.getFullYear()}`
}

/**
 * Groups tasks into columns starting from today (not calendar Monday).
 * Past-due tasks should be excluded by the API before calling this.
 */
export function groupTasksFromToday(
  tasks: Task[],
  reference = new Date(),
  dayCount = PLANNER_DAY_COUNT,
): ScheduleDay[] {
  const today = startOfDay(reference)

  return Array.from({ length: dayCount }, (_, index) => {
    const day = addDays(today, index)
    const isToday = index === 0

    return {
      label: isToday
        ? 'Today'
        : day.toLocaleDateString('en-US', { weekday: 'short' }),
      date: String(day.getDate()),
      isoDate: toLocalIsoDate(day),
      isToday,
      tasks: tasks.filter((task) => isSameDay(new Date(task.dueAt), day)),
    }
  })
}

export function splitDashboardTasks(tasks: Task[]) {
  const today = startOfDay(new Date())
  const activeCutoff = addDays(today, 2)

  const active = tasks.filter((task) => new Date(task.dueAt) <= activeCutoff)
  const upcoming = tasks.filter((task) => new Date(task.dueAt) > activeCutoff)

  return { active, upcoming }
}
