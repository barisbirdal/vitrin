export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-lg font-extrabold text-brand-500 ring-1 ring-white/10">
        v
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-stone-900'}`}>
        vitrin<span className="text-brand-500">.</span>
      </span>
    </span>
  )
}
