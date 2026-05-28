import { useState } from 'react'
import { createGroup, joinGroup, persistActiveGroup } from '../services/api'
import type { FlatGroup } from '../types'

type AddGroupModalProps = {
  open: boolean
  onClose: () => void
  onJoined: (group: FlatGroup) => void
}

type Tab = 'join' | 'create'

export default function AddGroupModal({
  open,
  onClose,
  onJoined,
}: AddGroupModalProps) {
  const [tab, setTab] = useState<Tab>('join')
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const group = await joinGroup(slug.trim().toLowerCase())
      persistActiveGroup(group)
      onJoined(group)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join group')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const group = await createGroup(name.trim())
      persistActiveGroup(group)
      onJoined(group)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create group')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-group-title"
      >
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <h2
              id="add-group-title"
              className="text-2xl font-bold text-on-surface"
            >
              Create or Join a Group
            </h2>
            <p className="mt-1 text-on-surface-variant">
              Organize tasks together in real-time
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        <div className="flex border-b border-surface-variant px-8">
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`flex-1 border-b-2 py-3 font-bold transition-colors ${
              tab === 'join'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant'
            }`}
          >
            Join
          </button>
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`flex-1 border-b-2 py-3 font-bold transition-colors ${
              tab === 'create'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant'
            }`}
          >
            Create
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-8">
          {tab === 'join' ? (
            <form className="space-y-6" onSubmit={handleJoin}>
              <div className="space-y-2">
                <label
                  className="ml-1 text-sm font-bold text-on-surface"
                  htmlFor="group-slug"
                >
                  Group slug
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary">
                      link
                    </span>
                  </div>
                  <input
                    id="group-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. the-crib"
                    className="block w-full rounded-2xl border-none bg-surface-container-low py-4 pr-4 pl-12 transition-all placeholder:text-on-surface-variant/60 focus:bg-surface focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="ml-1 text-xs text-on-surface-variant">
                  After seeding, join with slug <strong>the-crib</strong>
                </p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <span className="material-symbols-outlined">login</span>
                {submitting ? 'Joining…' : 'Join via slug'}
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleCreate}>
              <div className="space-y-2">
                <label
                  className="ml-1 text-sm font-bold text-on-surface"
                  htmlFor="group-name"
                >
                  Group name
                </label>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary">
                      badge
                    </span>
                  </div>
                  <input
                    id="group-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. The Crib"
                    className="block w-full rounded-2xl border-none bg-surface-container-low py-4 pr-4 pl-12 transition-all placeholder:text-on-surface-variant/60 focus:bg-surface focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                <span className="material-symbols-outlined">add_circle</span>
                {submitting ? 'Creating…' : 'Create group'}
              </button>
            </form>
          )}

          {error ? (
            <p className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
