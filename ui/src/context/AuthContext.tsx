import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getActiveGroupMeta,
  getToken,
  setActiveGroup,
  type StoredGroupMeta,
} from '../lib/storage'
import {
  fetchMe,
  loginUser,
  logoutLocal,
  registerUser,
} from '../services/api'
import type { User } from '../types'

type AuthContextValue = {
  user: User | null
  activeGroup: StoredGroupMeta | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    displayName: string,
    email: string,
    password: string,
  ) => Promise<void>
  logout: () => void
  setActiveGroupMeta: (group: StoredGroupMeta | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [activeGroup, setActiveGroupState] = useState<StoredGroupMeta | null>(
    getActiveGroupMeta,
  )
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      return
    }
    const me = await fetchMe()
    setUser(me)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        if (getToken()) {
          await refreshUser()
        }
      } catch {
        logoutLocal()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await loginUser({ email, password })
    setUser(loggedIn)
  }, [])

  const register = useCallback(
    async (displayName: string, email: string, password: string) => {
      const { user: registered } = await registerUser({
        displayName,
        email,
        password,
      })
      setUser(registered)
    },
    [],
  )

  const logout = useCallback(() => {
    logoutLocal()
    setUser(null)
    setActiveGroupState(null)
  }, [])

  const setActiveGroupMeta = useCallback((group: StoredGroupMeta | null) => {
    setActiveGroup(group)
    setActiveGroupState(group)
  }, [])

  const value = useMemo(
    () => ({
      user,
      activeGroup,
      loading,
      login,
      register,
      logout,
      setActiveGroupMeta,
      refreshUser,
    }),
    [
      user,
      activeGroup,
      loading,
      login,
      register,
      logout,
      setActiveGroupMeta,
      refreshUser,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
