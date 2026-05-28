import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { paths } from '../routes/paths'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        <span className="material-symbols-outlined animate-pulse text-4xl text-primary">
          home
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
