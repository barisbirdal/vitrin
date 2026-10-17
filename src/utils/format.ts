import type { Category, Product } from '../interfaces/product'

const currency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

export function formatPrice(value: number): string {
  return currency.format(value)
}

// İndirim yüzdesi (indirim yoksa 0)
export function discountPercent(product: Pick<Product, 'price' | 'oldPrice'>): number {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0
  return Math.round((1 - product.price / product.oldPrice) * 100)
}

// Yüzdeye "-e/-a/-ye/-ya" ekini getirir: 25 => "%25'e", 30 => "%30'a", 20 => "%20'ye"
// (Ek, sayının okunuşundaki son kelimeye göre seçilir: yirmi beş'e, otuz'a, yirmi'ye)
const UNIT_SUFFIX = ['', "'e", "'ye", "'e", "'e", "'e", "'ya", "'ye", "'e", "'a"]
const TEN_SUFFIX = ['', "'a", "'ye", "'a", "'a", "'ye", "'a", "'e", "'e", "'a"]

export function percentToDative(value: number): string {
  const n = Math.round(value)
  if (n === 100) return "%100'e"
  const suffix = n % 10 !== 0 ? UNIT_SUFFIX[n % 10] : TEN_SUFFIX[Math.floor(n / 10) % 10]
  return `%${n}${suffix}`
}

// Son 14 gün içinde eklenen ürünler "Yeni" sayılır
export function isNew(product: Pick<Product, 'createdAt'>): boolean {
  return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
}

export const CATEGORY_STYLE: Record<Category, { emoji: string; bg: string }> = {
  Elektronik: { emoji: '🎧', bg: 'bg-sky-100' },
  Giyim: { emoji: '👕', bg: 'bg-rose-100' },
  'Ev & Yaşam': { emoji: '🪴', bg: 'bg-emerald-100' },
  Kitap: { emoji: '📚', bg: 'bg-amber-100' },
  Spor: { emoji: '⚽', bg: 'bg-lime-100' },
  Kozmetik: { emoji: '🧴', bg: 'bg-fuchsia-100' },
}
