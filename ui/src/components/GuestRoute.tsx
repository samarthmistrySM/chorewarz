import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paths } from '../routes/paths'

/** Auth pages — send logged-in users to group picker. */
export default function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="material-symbols-outlined animate-pulse text-4xl text-primary">
          home
        </span>
      </div>
    )
  }

  if (user) {
    return <Navigate to={paths.groups} replace />
  }

  return <Outlet />
}
