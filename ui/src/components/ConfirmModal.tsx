import { useEffect } from 'react'

type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: string
  variant?: 'danger' | 'default'
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon = 'help',
  variant = 'default',
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const confirmClass =
    variant === 'danger'
      ? 'bg-error text-on-error hover:opacity-90'
      : 'bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-90'

  const iconWrapClass =
    variant === 'danger'
      ? 'bg-error-container text-on-error-container'
      : 'bg-primary-container text-on-primary-container'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[2rem] bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
      >
        <div className="p-8">
          <div className="mb-6 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div
              className={`mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:mb-0 sm:mr-4 ${iconWrapClass}`}
            >
              <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div>
              <h2
                id="confirm-modal-title"
                className="text-xl font-bold text-on-surface sm:text-2xl"
              >
                {title}
              </h2>
              <p
                id="confirm-modal-desc"
                className="mt-2 text-on-surface-variant"
              >
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-6 py-3.5 font-bold text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-2xl px-6 py-3.5 font-bold transition-all active:scale-[0.98] ${confirmClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
