import ConfirmModal from './ConfirmModal'

type LogoutConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Log out?"
      description="You'll need to sign in again to access your groups and tasks."
      confirmLabel="Log out"
      cancelLabel="Stay signed in"
      icon="logout"
      variant="danger"
    />
  )
}
