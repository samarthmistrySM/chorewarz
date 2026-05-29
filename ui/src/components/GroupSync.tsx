import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchGroups, persistActiveGroup } from '../services/api'
import { paths } from '../routes/paths'

/**
 * Ensures :groupId in the URL matches the active group in context/storage.
 * Renders child routes once the group is valid for the current user.
 */
export default function GroupSync() {
  const { groupId } = useParams<{ groupId: string }>()
  const { activeGroup, setActiveGroupMeta } = useAuth()
  const [ready, setReady] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function sync() {
      setLoadError(null)

      if (!groupId) {
        setInvalid(true)
        return
      }

      if (activeGroup?.id === groupId) {
        setReady(true)
        return
      }

      setReady(false)
      try {
        const groups = await fetchGroups()
        const match = groups.find((g) => g.id === groupId)
        if (cancelled) return

        if (!match) {
          setInvalid(true)
          return
        }

        persistActiveGroup(match)
        setActiveGroupMeta({
          id: match.id,
          name: match.name,
          slug: match.slug,
        })
        setReady(true)
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Could not load group',
          )
        }
      }
    }

    sync()
    return () => {
      cancelled = true
    }
  }, [groupId, activeGroup?.id, setActiveGroupMeta])

  if (invalid) {
    return <Navigate to={paths.groups} replace />
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center text-on-surface-variant">
        <p>{loadError}</p>
        <p className="text-sm text-outline">
          Check that the API is running and{' '}
          <code className="text-on-surface-variant">VITE_API_URL</code> points to
          it in production.
        </p>
        <button
          type="button"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-on-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        Loading group…
      </div>
    )
  }

  return <Outlet />
}
