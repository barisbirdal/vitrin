import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { CATEGORIES, type Category } from '../interfaces/product'
import { CATEGORY_STYLE, discountPercent, percentToDative } from '../utils/format'
import { HERO_IMAGE } from '../data/seedProducts'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import { ArrowRightIcon, HeadsetIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'

type Sort = 'newest' | 'price-asc' | 'price-desc' | 'name' | 'discount'

const FEATURES = [
  { icon: TruckIcon, title: 'Ücretsiz kargo', text: '1.000 ₺ üzeri siparişlerde' },
  { icon: ReturnIcon, title: 'Kolay iade', text: '14 gün içinde ücretsiz' },
  { icon: ShieldIcon, title: 'Güvenli ödeme', text: '256-bit SSL koruması' },
  { icon: HeadsetIcon, title: '7/24 destek', text: 'Her zaman yanınızdayız' },
]

export default function HomePage() {
  const { products } = useStore()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState<Sort>('newest')
  const [onlyDiscounted, setOnlyDiscounted] = useState(false)

  const search = params.get('q') ?? ''
  const category = params.get('kategori') ?? 'Tümü'

  function setCategory(c: string) {
    const next = new URLSearchParams(params)
    if (c === 'Tümü') next.delete('kategori')
    else next.set('kategori', c)
    setParams(next, { replace: true })
  }

  function clearSearch() {
    const next = new URLSearchParams(params)
    next.delete('q')
    setParams(next, { replace: true })
  }

  const visible = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr')
    const filtered = products.filter(
      (p) =>
        (category === 'Tümü' || p.category === category) &&
        (!onlyDiscounted || discountPercent(p) > 0) &&
        [p.name, p.description, p.category].some((s) => s.toLocaleLowerCase('tr').includes(q)),
    )
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name, 'tr')
        case 'discount':
          return discountPercent(b) - discountPercent(a)
        default:
          return b.createdAt.localeCompare(a.createdAt)
      }
    })
  }, [products, search, category, sort, onlyDiscounted])

  const countByCategory = (c: Category) => products.filter((p) => p.category === c).length
  const discountedCount = products.filter((p) => discountPercent(p) > 0).length
  // Karşılama kutusundaki "...'e varan indirim" oranı ürünlerdeki en yüksek indirimden hesaplanır
  const maxDiscount = Math.max(0, ...products.map(discountPercent))

  return (
    <div className="space-y-16">
      {/* Karşılama alanı */}
      <section className="relative overflow-hidden rounded-[2rem] bg-stone-900 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative z-10 space-y-6 px-6 py-12 sm:px-12 lg:py-20">
            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Tarzını yansıtan ürünler, <span className="text-brand-400">tek vitrinde.</span>
            </h1>
            <p className="max-w-md text-base text-stone-300 sm:text-lg">
              Yüzlerce kategori, seçkin markalar ve size özel indirimler. Sepetinizi doldurun, gerisini bize bırakın.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#urunler"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
              >
                Alışverişe başla <ArrowRightIcon />
              </a>
              {discountedCount > 0 && (
                <button
                  onClick={() => {
                    setOnlyDiscounted(true)
                    document.getElementById('urunler')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10"
                >
                  {discountedCount} indirimli ürün
                </button>
              )}
            </div>
          </div>

          <div className="relative h-72 lg:h-full lg:min-h-[480px]">
            <img src={HERO_IMAGE} alt="Mağaza vitrini" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent lg:bg-gradient-to-r" />
            {maxDiscount > 0 && (
              <div className="absolute right-6 bottom-6 hidden rounded-2xl bg-white/95 p-4 text-stone-900 shadow-xl sm:block">
                <p className="text-xs font-semibold text-stone-500">Bu haftaya özel</p>
                <p className="text-2xl font-extrabold">
                  {percentToDative(maxDiscount)} varan <span className="text-brand-600">indirim</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Avantajlar */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200 sm:p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl text-brand-600">
              <Icon />
            </span>
            <div>
              <p className="text-sm font-bold text-stone-900">{title}</p>
              <p className="text-xs text-stone-500">{text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Kategoriler */}
      <section className="space-y-6">
        <SectionTitle eyebrow="Keşfet" title="Kategoriler" />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <a
              key={c}
              href="#urunler"
              onClick={() => setCategory(c)}
              className={`group flex flex-col items-center gap-3 rounded-2xl p-4 text-center ring-1 transition hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                category === c ? 'bg-stone-900 text-white ring-stone-900' : 'bg-white ring-stone-200'
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl transition group-hover:scale-110 sm:h-16 sm:w-16 ${CATEGORY_STYLE[c].bg}`}
              >
                {CATEGORY_STYLE[c].emoji}
              </span>
              <span>
                <span className="block text-sm font-bold">{c}</span>
                <span className={`text-xs ${category === c ? 'text-stone-300' : 'text-stone-500'}`}>
                  {countByCategory(c)} ürün
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Ürünler */}
      <section id="urunler" className="scroll-mt-32 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Mağaza" title={category === 'Tümü' ? 'Tüm ürünler' : category} />
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-stone-200">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
                className="h-4 w-4 accent-brand-500"
              />
              Sadece indirimli
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-stone-200 outline-none"
              aria-label="Sıralama"
            >
              <option value="newest">En yeni</option>
              <option value="discount">En çok indirim</option>
              <option value="price-asc">Fiyat: düşükten yükseğe</option>
              <option value="price-desc">Fiyat: yüksekten düşüğe</option>
              <option value="name">İsim (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Tümü', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                category === c ? 'bg-brand-500 text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
              }`}
            >
              {c}
            </button>
          ))}
          {search && (
            <button
              onClick={clearSearch}
              className="rounded-full bg-stone-900 px-4 py-1.5 text-sm font-semibold text-white"
              title="Aramayı temizle"
            >
              "{search}" ✕
            </button>
          )}
          <span className="ml-auto text-sm text-stone-500">{visible.length} ürün</span>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="Ürün bulunamadı"
            description="Arama veya filtreleri değiştirmeyi deneyin."
            action={
              <Link
                to="/"
                onClick={() => setOnlyDiscounted(false)}
                className="text-sm font-semibold text-brand-600 hover:underline"
              >
                Filtreleri temizle
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
    </div>
  )
}
