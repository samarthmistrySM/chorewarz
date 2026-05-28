import { Navigate, Route, Routes } from 'react-router-dom'
import GroupSync from '../components/GroupSync'
import GuestRoute from '../components/GuestRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import GroupLayout from '../layouts/GroupLayout'
import DashboardPage from '../pages/DashboardPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import SchedulePage from '../pages/SchedulePage'
import { getActiveGroupId } from '../lib/storage'
import { paths } from './paths'

function RootRedirect() {
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

  if (!user) {
    return <Navigate to={paths.login} replace />
  }

  const lastGroupId = getActiveGroupId()
  if (lastGroupId) {
    return <Navigate to={paths.groupDashboard(lastGroupId)} replace />
  }

  return <Navigate to={paths.groups} replace />
}

function LegacyDashboardRedirect() {
  const lastGroupId = getActiveGroupId()
  if (lastGroupId) {
    return <Navigate to={paths.groupDashboard(lastGroupId)} replace />
  }
  return <Navigate to={paths.groups} replace />
}

function LegacyScheduleRedirect() {
  const lastGroupId = getActiveGroupId()
  if (lastGroupId) {
    return <Navigate to={paths.groupSchedule(lastGroupId)} replace />
  }
  return <Navigate to={paths.groups} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public auth */}
      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<RegisterPage />} />
      </Route>

      {/* Logged-in */}
      <Route element={<ProtectedRoute />}>
        <Route path={paths.groups} element={<HomePage />} />

        <Route path="/groups/:groupId" element={<GroupSync />}>
          <Route element={<GroupLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="schedule" element={<SchedulePage />} />
          </Route>
        </Route>
      </Route>

      {/* Legacy URLs */}
      <Route path="/home" element={<Navigate to={paths.groups} replace />} />
      <Route path="/dashboard" element={<LegacyDashboardRedirect />} />
      <Route path="/schedule" element={<LegacyScheduleRedirect />} />

      <Route path={paths.root} element={<RootRedirect />} />
      <Route path="*" element={<Navigate to={paths.root} replace />} />
    </Routes>
  )
}
