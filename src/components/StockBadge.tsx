export default function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Badge className="bg-red-50 text-red-700 ring-red-200" dot="bg-red-500" label="Tükendi" />
  }
  if (stock <= 5) {
    return <Badge className="bg-amber-50 text-amber-800 ring-amber-200" dot="bg-amber-500" label={`Son ${stock} adet`} />
  }
  return <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200" dot="bg-emerald-500" label="Stokta" />
}

function Badge({ className, dot, label }: { className: string; dot: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
