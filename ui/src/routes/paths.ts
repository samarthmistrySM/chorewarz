/** Central route paths — use these instead of hard-coded strings. */
export const paths = {
  root: '/',
  login: '/login',
  register: '/register',
  groups: '/groups',
  group: (groupId: string) => `/groups/${groupId}`,
  groupDashboard: (groupId: string) => `/groups/${groupId}/dashboard`,
  groupSchedule: (groupId: string) => `/groups/${groupId}/schedule`,
} as const

/** Redirect legacy URLs from earlier builds. */
export const legacyRedirects = [
  { from: '/home', to: paths.groups },
  { from: '/dashboard', to: paths.groups },
  { from: '/schedule', to: paths.groups },
] as const
