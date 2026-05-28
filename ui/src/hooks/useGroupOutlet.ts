import { useOutletContext } from 'react-router-dom'

export type GroupOutletContext = {
  taskRefresh: number
  bumpRefresh: () => void
}

export function useGroupOutlet() {
  return useOutletContext<GroupOutletContext>()
}
