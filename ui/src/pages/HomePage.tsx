import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddGroupModal from '../components/AddGroupModal'
import LogoutConfirmModal from '../components/LogoutConfirmModal'
import { useAuth } from '../context/AuthContext'
import { fetchGroups, persistActiveGroup } from '../services/api'
import { APP_NAME } from '../constants/brand'
import { paths } from '../routes/paths'
import type { FlatGroup } from '../types'

export default function HomePage() {
  const { user, logout, setActiveGroupMeta } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState<FlatGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [error, setError] = useState('')

  const loadGroups = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchGroups()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load groups')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  function selectGroup(group: FlatGroup) {
    persistActiveGroup(group)
    setActiveGroupMeta({
      id: group.id,
      name: group.name,
      slug: group.slug,
    })
    navigate(paths.groupDashboard(group.id))
  }

  function handleGroupJoined(group: FlatGroup) {
    setGroups((prev) => {
      if (prev.some((g) => g.id === group.id)) return prev
      return [group, ...prev]
    })
    selectGroup(group)
  }

  return (
    <div className="relative flex h-dvh max-h-dvh w-full max-w-full flex-col overflow-hidden bg-surface text-on-surface">
      <div className="pointer-events-none fixed top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-secondary/5 blur-[80px]" />

      <header className="z-50 w-full shrink-0 bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-container-padding-mobile md:px-container-padding-desktop">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            {APP_NAME}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(paths.groups)}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              aria-label="Account"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="hidden rounded-full px-3 py-1.5 text-sm font-bold text-error hover:bg-error-container sm:block"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full min-h-0 min-w-0 max-w-[1200px] flex-1 flex-col items-center overflow-x-hidden overflow-y-auto px-container-padding-mobile py-8 md:py-12">
        <div className="mb-8 w-full shrink-0 text-center md:mb-12">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight break-words text-on-surface sm:text-4xl md:text-5xl">
            Welcome back, {user?.displayName ?? 'there'}!
          </h2>
          <p className="text-base font-medium text-on-surface-variant sm:text-lg md:text-xl">
            Choose your flat to start tracking tasks.
          </p>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="text-on-surface-variant">Loading your groups…</p>
        ) : (
          <div className="grid w-full min-w-0 max-w-4xl grid-cols-1 gap-6 md:grid-cols-12">
            {groups.map((group, index) => (
              <div
                key={group.id}
                className={`min-w-0 ${index === 0 ? 'md:col-span-7' : 'md:col-span-5'}`}
              >
                <button
                  type="button"
                  onClick={() => selectGroup(group)}
                  className="relative flex h-full min-h-[200px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-3xl border-2 border-primary/10 bg-[linear-gradient(135deg,rgba(44,80,205,0.05)_0%,rgba(44,80,205,0.02)_100%)] p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-xl sm:min-h-[240px] sm:p-8 md:hover:-translate-y-1"
                >
                  <div className="relative z-10 min-w-0">
                    <div className="mb-4 flex items-start justify-between gap-2 sm:mb-6">
                      <div className="rounded-2xl bg-primary-container p-3 text-on-primary-container">
                        <span className="material-symbols-outlined text-3xl">
                          home
                        </span>
                      </div>
                      {index === 0 ? (
                        <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wider text-on-primary uppercase">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mb-2 truncate text-2xl font-bold sm:text-3xl">
                      {group.name}
                    </h3>
                    <p className="mb-4 text-sm text-on-surface-variant sm:mb-6 sm:text-base">
                      {group.memberCount} Members · {group.pendingTasks} Pending
                      Tasks
                    </p>
                    <p className="truncate text-sm text-outline">/{group.slug}</p>
                  </div>
                  <div className="pointer-events-none absolute right-0 bottom-0 overflow-hidden opacity-10 transition-opacity group-hover:opacity-20">
                    <span className="material-symbols-outlined block translate-x-1/4 translate-y-1/4 text-[8rem] sm:text-[10rem]">
                      location_city
                    </span>
                  </div>
                </button>
              </div>
            ))}

            <div
              className={`min-w-0 ${groups.length === 0 ? 'md:col-span-12' : 'md:col-span-5'}`}
            >
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex h-full min-h-[200px] w-full min-w-0 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-outline/30 p-6 transition-all duration-300 hover:border-primary hover:bg-primary-container/20 sm:min-h-[240px] sm:p-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high transition-all group-hover:bg-primary">
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-on-surface">
                    Add New Group
                  </span>
                  <span className="mt-1 block text-sm text-on-surface-variant">
                    Found a new flat? Create a hub.
                  </span>
                </div>
              </button>
            </div>

            <div className="min-w-0 md:col-span-12">
              <div className="flex min-w-0 flex-col items-center justify-between gap-6 rounded-3xl bg-surface-container-low p-6 md:flex-row">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-on-surface">
                      Need help getting started?
                    </h4>
                    <p className="text-sm break-words text-on-surface-variant">
                      Run <code className="text-primary">npm run seed</code> on the
                      server, then join slug <strong>the-crib</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AddGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onJoined={handleGroupJoined}
      />

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => {
          logout()
          navigate(paths.login)
          setLogoutOpen(false)
        }}
      />
    </div>
  )
}
