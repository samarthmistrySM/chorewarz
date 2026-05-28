export type User = {
  id: string
  email: string
  displayName: string
}

export type FlatGroup = {
  id: string
  name: string
  slug: string
  role: 'admin' | 'member'
  memberCount: number
  pendingTasks: number
}

export type Member = {
  _id: string
  name: string
  displayName: string
  color: string
}

export type TaskCategory =
  | 'groceries'
  | 'cleaning'
  | 'bills'
  | 'trash'
  | 'water_motor'

export type TaskType =
  | 'garbage'
  | 'water'
  | 'cleaning'
  | 'groceries'
  | 'bills'

export type Task = {
  _id: string
  title: string
  description?: string
  type: TaskType
  category?: TaskCategory
  owner: Member
  dueAt: string
  completedAt?: string | null
}

export type CreateTaskPayload = {
  title: string
  ownerId: string
  dueAt: string
  category: TaskCategory
}

export type AuthResponse = {
  token: string
  user: User
}
