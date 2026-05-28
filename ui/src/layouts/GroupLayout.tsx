import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import AddTaskModal from '../components/AddTaskModal'
import LogoutConfirmModal from '../components/LogoutConfirmModal'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../constants/brand'
import { paths } from '../routes/paths'

export default function GroupLayout() {
  const { groupId } = useParams<{ groupId: string }>()
  const { activeGroup, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [addTaskOpen, setAddTaskOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [taskRefresh, setTaskRefresh] = useState(0)

  const page = location.pathname.endsWith('/schedule') ? 'schedule' : 'dashboard'

  useEffect(() => {
    document.body.style.overflow =
      mobileNavOpen || addTaskOpen || logoutOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen, addTaskOpen, logoutOpen])

  if (!groupId) {
    return null
  }

  const topbarTitle =
    page === 'dashboard' ? APP_NAME : 'Schedule View'

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="flex min-h-screen">
        <Sidebar
          groupName={activeGroup?.name ?? 'Your flat'}
          currentPage={page}
          onNavigate={(target) => {
            navigate(
              target === 'dashboard'
                ? paths.groupDashboard(groupId)
                : paths.groupSchedule(groupId),
            )
            setMobileNavOpen(false)
          }}
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onAddTask={() => setAddTaskOpen(true)}
          onLogoutRequest={() => setLogoutOpen(true)}
          onSwitchGroup={() => navigate(paths.groups)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            title={topbarTitle}
            mobileTitle={APP_NAME}
            onMenuClick={() => setMobileNavOpen(true)}
          />
          <Outlet context={{ taskRefresh, bumpRefresh: () => setTaskRefresh((n) => n + 1) }} />
        </div>
      </div>

      <AddTaskModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onCreated={() => setTaskRefresh((n) => n + 1)}
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
