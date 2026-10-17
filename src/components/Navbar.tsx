import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import Logo from './Logo'
import { BagIcon, SearchIcon, ChartIcon } from './Icons'

export default function Navbar() {
  const { cartCount, cartTotal } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  // URL'deki arama değiştiğinde kutuyu güncelle
  useEffect(() => setQuery(params.get('q') ?? ''), [params])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}#urunler` : '/#urunler')
  }

  const searchBox = (
    <form onSubmit={handleSearch} className="relative w-full" role="search">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg text-stone-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün veya kategori ara"
        className="w-full rounded-full border border-stone-200 bg-stone-100 py-2.5 pr-4 pl-11 text-sm outline-none transition placeholder:text-stone-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </form>
  )

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-stone-900 px-4 py-2 text-center text-xs font-medium text-stone-200">
        🚚 1.000 ₺ ve üzeri siparişlerde <span className="text-brand-300">kargo bedava</span> · 14 gün içinde ücretsiz iade
      </div>

      <div className="border-b border-stone-200 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:gap-8">
          {/* Ana sayfadayken de en üste dönsün (aynı adrese gidildiğinde sayfa kaymaz) */}
          <Link to="/" aria-label="Vitrin ana sayfa" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo />
          </Link>

          <div className="hidden flex-1 md:block">{searchBox}</div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <NavLink
              to="/yonetim"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ring-1 transition ${
                  isActive
                    ? 'bg-stone-900 text-white ring-stone-900'
                    : 'bg-white text-stone-800 ring-stone-300 hover:bg-stone-900 hover:text-white hover:ring-stone-900'
                }`
              }
            >
              <ChartIcon className="text-lg" />
              <span className="hidden sm:inline">Yönetim</span>
            </NavLink>

            <NavLink
              to="/sepet"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full py-2.5 pr-2.5 pl-4 text-sm font-bold text-white shadow-md shadow-brand-500/30 transition ${
                  isActive ? 'bg-brand-600' : 'bg-brand-500 hover:bg-brand-600'
                }`
              }
            >
              <BagIcon className="text-lg" />
              <span>Sepetim</span>
              {cartTotal > 0 && (
                <span className="hidden font-semibold text-brand-100 lg:inline">{formatPrice(cartTotal)}</span>
              )}
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-extrabold text-brand-600">
                {cartCount}
              </span>
            </NavLink>
          </div>
        </nav>

        <div className="px-4 pb-3 md:hidden">{searchBox}</div>
      </div>
    </header>
  )
}
