import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AlertIcon, BagIcon, ResetIcon, TrashIcon } from './Icons'

// Tarayıcının window.confirm kutusu yerine kullanılan, siteyle uyumlu onay penceresi.
// Kullanım: const confirm = useConfirm(); if (await confirm({ title: '...' })) { ... }

type Tone = 'danger' | 'primary'
type IconName = 'trash' | 'bag' | 'reset' | 'alert'

export interface ConfirmOptions {
  title: string
  message?: ReactNode
  confirmText?: string
  cancelText?: string
  tone?: Tone
  icon?: IconName
}

const ICONS = { trash: TrashIcon, bag: BagIcon, reset: ResetIcon, alert: AlertIcon }

const TONES: Record<Tone, { icon: string; button: string }> = {
  danger: {
    icon: 'bg-red-50 text-red-600',
    button: 'bg-red-600 hover:bg-red-700 shadow-red-600/25',
  },
  primary: {
    icon: 'bg-brand-50 text-brand-600',
    button: 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/30',
  },
}

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null)

interface Pending extends ConfirmOptions {
  resolve: (value: boolean) => void
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null)

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  )

  function close(result: boolean) {
    pending?.resolve(result)
    setPending(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && <Dialog options={pending} onClose={close} />}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm, ConfirmProvider içinde kullanılmalı')
  return ctx
}

function Dialog({ options, onClose }: { options: ConfirmOptions; onClose: (result: boolean) => void }) {
  const { title, message, confirmText = 'Onayla', cancelText = 'Vazgeç', tone = 'primary', icon = 'alert' } = options
  const confirmRef = useRef<HTMLButtonElement>(null)
  const Icon = ICONS[icon]
  const style = TONES[tone]

  // Açılınca onay butonuna odaklan, Esc ile kapat, arka plan kaymasın
  useEffect(() => {
    confirmRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose(false)
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
      onClick={() => onClose(false)}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md animate-pop-in rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${style.icon}`}>
            <Icon />
          </span>
          <h2 id="confirm-title" className="mt-4 text-xl font-extrabold text-stone-900">
            {title}
          </h2>
          {message && <div className="mt-2 text-sm leading-relaxed text-stone-500">{message}</div>}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            onClick={() => onClose(false)}
            className="flex-1 rounded-full px-5 py-3 text-sm font-bold text-stone-700 ring-1 ring-stone-200 transition hover:bg-stone-50"
          >
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            onClick={() => onClose(true)}
            className={`flex-1 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg transition outline-none focus-visible:ring-4 focus-visible:ring-stone-300 ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
