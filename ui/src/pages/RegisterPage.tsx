import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../constants/brand'
import { paths } from '../routes/paths'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setSubmitting(true)
    try {
      await register(displayName, email, password)
      navigate(paths.groups, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-on-surface">
      <div className="pointer-events-none fixed top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-secondary/5 blur-[80px]" />

      <header className="sticky top-0 z-10 w-full bg-surface">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-container-padding-mobile md:px-container-padding-desktop">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            {APP_NAME}
          </h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-container-padding-mobile py-12">
        <div className="w-full max-w-md rounded-[2rem] bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(44,80,205,0.08)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-3xl">person_add</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Create account</h2>
            <p className="mt-1 text-on-surface-variant">
              Join your flatmates on shared chores
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-bold text-on-surface"
                htmlFor="displayName"
              >
                Display name
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary">
                    badge
                  </span>
                </div>
                <input
                  id="displayName"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Username"
                  className="block w-full rounded-2xl border-none bg-surface-container-low py-4 pr-4 pl-12 transition-all placeholder:text-on-surface-variant/60 focus:bg-surface focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-bold text-on-surface"
                htmlFor="email"
              >
                Email
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-outline group-focus-within:text-primary">
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full rounded-2xl border-none bg-surface-container-low py-4 pr-4 pl-12 transition-all placeholder:text-on-surface-variant/60 focus:bg-surface focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-bold text-on-surface"
                htmlFor="password"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-bold text-on-surface"
                htmlFor="confirmPassword"
              >
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                leftIcon="lock_reset"
              />
            </div>

            {error ? (
              <p className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to={paths.login} className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
