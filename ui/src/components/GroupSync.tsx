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

  useEffect(() => {
    let cancelled = false

    async function sync() {
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
      } catch {
        if (!cancelled) setInvalid(true)
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

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        Loading group…
      </div>
    )
  }

  return <Outlet />
}
