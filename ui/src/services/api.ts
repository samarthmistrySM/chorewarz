import {
  clearAuthStorage,
  getActiveGroupId,
  getToken,
  setActiveGroup,
  setToken,
  type StoredGroupMeta,
} from '../lib/storage'
import type {
  AuthResponse,
  CreateTaskPayload,
  FlatGroup,
  Member,
  Task,
  User,
} from '../types'

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000'

type ApiOptions = RequestInit & {
  skipAuth?: boolean
  skipGroup?: boolean
}

async function parseError(response: Response) {
  const body = await response.json().catch(() => ({}))
  return (body.message as string) ?? (body.error as string) ?? 'Request failed'
}

function buildHeaders(options: ApiOptions): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (!options.skipAuth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  if (!options.skipGroup) {
    const groupId = getActiveGroupId()
    if (groupId) headers['X-Group-Id'] = groupId
  }

  return headers
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, skipGroup, ...init } = options
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders({ skipAuth, skipGroup, headers: init.headers }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function registerUser(payload: {
  email: string
  password: string
  displayName: string
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
    skipGroup: true,
  })
  setToken(data.token)
  return data
}

export async function loginUser(payload: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
    skipGroup: true,
  })
  setToken(data.token)
  return data
}

export async function fetchMe(): Promise<User> {
  const data = await apiFetch<{ user: User }>('/api/auth/me')
  return data.user
}

export function logoutLocal() {
  clearAuthStorage()
}

export async function fetchGroups(): Promise<FlatGroup[]> {
  const data = await apiFetch<{ groups: FlatGroup[] }>('/api/groups', {
    skipGroup: true,
  })
  return data.groups
}

export async function createGroup(name: string): Promise<FlatGroup> {
  const data = await apiFetch<{ group: FlatGroup }>('/api/groups', {
    method: 'POST',
    body: JSON.stringify({ name }),
    skipGroup: true,
  })
  return data.group
}

export async function joinGroup(slug: string): Promise<FlatGroup> {
  const data = await apiFetch<{ group: FlatGroup }>('/api/groups/join', {
    method: 'POST',
    body: JSON.stringify({ slug }),
    skipGroup: true,
  })
  return data.group
}

export function persistActiveGroup(group: FlatGroup | StoredGroupMeta) {
  setActiveGroup({
    id: group.id,
    name: group.name,
    slug: group.slug,
  })
}

export async function fetchMembers() {
  const data = await apiFetch<{ members: Member[] }>('/api/members')
  return data.members
}

/** Current user's flatmate profile in the active group (for assignee default). */
export async function fetchMyMember() {
  const data = await apiFetch<{ member: Member }>('/api/members/me')
  return data.member
}

export async function fetchTasks() {
  const data = await apiFetch<{ tasks: Task[]; progress: number }>('/api/tasks')
  return {
    tasks: data.tasks,
    progress: data.progress ?? 0,
  }
}

export async function fetchSchedule() {
  const data = await apiFetch<{ schedule: Task[] }>('/api/tasks/schedule')
  return data.schedule
}

export async function createTask(payload: CreateTaskPayload) {
  return apiFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function completeTask(taskId: string) {
  return apiFetch(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
  })
}
