import { useStore } from '../context/StoreContext'
import { AlertIcon, CheckIcon, InfoIcon } from './Icons'

const STYLES = {
  success: { icon: CheckIcon, color: 'bg-emerald-500' },
  error: { icon: AlertIcon, color: 'bg-red-500' },
  info: { icon: InfoIcon, color: 'bg-stone-500' },
}

export default function Toasts() {
  const { toasts } = useStore()

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const { icon: Icon, color } = STYLES[t.type]
        return (
          <div
            key={t.id}
            className="flex animate-toast-in items-center gap-3 rounded-2xl bg-stone-900 py-3 pr-5 pl-3 text-sm font-medium text-white shadow-xl shadow-stone-900/20"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${color}`}>
              <Icon className="text-base" />
            </span>
            {t.message}
          </div>
        )
      })}
    </div>
  )
}
