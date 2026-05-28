import { useState } from 'react'

type PasswordInputProps = {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
  leftIcon?: string
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete,
  required,
  leftIcon = 'lock',
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">
          {leftIcon}
        </span>
      </div>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-2xl border-none bg-surface-container-low py-4 pr-12 pl-12 transition-all placeholder:text-on-surface-variant/60 focus:bg-surface focus:ring-2 focus:ring-primary"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center rounded-r-2xl px-4 text-outline transition-colors hover:text-primary focus:text-primary focus:outline-none"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        <span className="material-symbols-outlined text-[22px]">
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  )
}
