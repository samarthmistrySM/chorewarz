type SidebarProps = {
  groupName: string
  currentPage: 'dashboard' | 'schedule'
  onNavigate: (page: 'dashboard' | 'schedule') => void
  mobileOpen: boolean
  onClose: () => void
  onAddTask: () => void
  /** Opens logout confirmation — does not log out immediately. */
  onLogoutRequest: () => void
  onSwitchGroup: () => void
}

export default function Sidebar({
  groupName,
  currentPage,
  onNavigate,
  mobileOpen,
  onClose,
  onAddTask,
  onLogoutRequest,
  onSwitchGroup,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#2d3133]/40 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh w-[min(85vw,280px)] shrink-0 flex-col overflow-hidden border-r border-surface-variant bg-surface-container-low p-base transition-transform duration-300 ease-out md:sticky md:top-0 md:z-auto md:flex md:h-screen md:max-h-none md:w-64 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 px-1 py-2">
          <button
            type="button"
            onClick={onSwitchGroup}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left transition-colors hover:bg-surface-variant"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
              <span className="material-symbols-outlined">home</span>
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-title-md text-title-md text-on-surface">
                {groupName}
              </h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Switch group
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-surface-variant md:hidden"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              currentPage === 'dashboard'
                ? 'bg-secondary-container font-bold text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined shrink-0">dashboard</span>
            <span className="font-label-sm text-label-sm">Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              currentPage === 'schedule'
                ? 'bg-secondary-container font-bold text-on-secondary-container'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined shrink-0">
              calendar_today
            </span>
            <span className="font-label-sm text-label-sm">Schedule</span>
          </button>
          <button
            type="button"
            onClick={onSwitchGroup}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-on-surface-variant transition-all hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined shrink-0">group</span>
            <span className="font-label-sm text-label-sm">My Groups</span>
          </button>
        </nav>

        <div className="flex shrink-0 flex-col gap-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => {
              onAddTask()
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-label-sm text-label-sm text-on-primary shadow-sm transition-colors hover:bg-primary-container hover:text-on-primary-container"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '18px' }}
            >
              add
            </span>
            Add New Task
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onLogoutRequest()
            }}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-error transition-all hover:bg-error-container"
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span className="font-label-sm text-label-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
