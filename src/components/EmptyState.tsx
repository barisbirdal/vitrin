import type { ReactNode } from 'react'

interface Props {
  icon: string
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-stone-200">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-4xl">{icon}</span>
      <h3 className="mt-2 text-xl font-extrabold text-stone-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
