const TOKEN_KEY = 'auth_token'
const GROUP_ID_KEY = 'active_group_id'
const GROUP_META_KEY = 'active_group_meta'

export type StoredGroupMeta = {
  id: string
  name: string
  slug: string
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getActiveGroupId(): string | null {
  return localStorage.getItem(GROUP_ID_KEY)
}

export function setActiveGroup(meta: StoredGroupMeta | null) {
  if (meta) {
    localStorage.setItem(GROUP_ID_KEY, meta.id)
    localStorage.setItem(GROUP_META_KEY, JSON.stringify(meta))
  } else {
    localStorage.removeItem(GROUP_ID_KEY)
    localStorage.removeItem(GROUP_META_KEY)
  }
}

export function getActiveGroupMeta(): StoredGroupMeta | null {
  const raw = localStorage.getItem(GROUP_META_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredGroupMeta
  } catch {
    return null
  }
}

export function clearAuthStorage() {
  setToken(null)
  setActiveGroup(null)
}
