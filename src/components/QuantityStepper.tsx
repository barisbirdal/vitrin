import { MinusIcon, PlusIcon } from './Icons'

interface Props {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: 'sm' | 'lg'
}

export default function QuantityStepper({ value, onChange, max, size = 'sm' }: Props) {
  const pad = size === 'lg' ? 'h-12 w-12' : 'h-9 w-9'
  return (
    <div className="inline-flex items-center rounded-full bg-stone-100 p-1">
      <button
        onClick={() => onChange(value - 1)}
        className={`${pad} flex items-center justify-center rounded-full text-stone-700 transition hover:bg-white hover:shadow-sm`}
        aria-label="Azalt"
      >
        <MinusIcon />
      </button>
      <span className="w-9 text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        className={`${pad} flex items-center justify-center rounded-full text-stone-700 transition hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none`}
        aria-label="Artır"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
