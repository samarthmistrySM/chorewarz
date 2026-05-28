import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../context/AuthContext'
import { APP_NAME } from '../constants/brand'
import { paths } from '../routes/paths'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(paths.groups, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
              <span className="material-symbols-outlined text-3xl">login</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Welcome back</h2>
            <p className="mt-1 text-on-surface-variant">
              Sign in to manage your flat&apos;s chores
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-bold text-on-surface"
                htmlFor="email"
              >
                Email
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <span className="material-symbols-outlined">login</span>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            New here?{' '}
            <Link
              to={paths.register}
              className="font-bold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
