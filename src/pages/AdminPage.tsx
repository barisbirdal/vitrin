import { useMemo, useState, type ComponentType, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import type { Product, ProductInput } from '../interfaces/product'
import { discountPercent, formatPrice } from '../utils/format'
import ProductForm from '../components/ProductForm'
import ProductImage from '../components/ProductImage'
import StockBadge from '../components/StockBadge'
import EmptyState from '../components/EmptyState'
import { useConfirm } from '../components/ConfirmDialog'
import { AlertIcon, BoxIcon, ChartIcon, EditIcon, ResetIcon, SearchIcon, TagIcon, TrashIcon } from '../components/Icons'

// Yönetim paneli: ürünler için Ekle / Listele / Güncelle / Sil işlemleri
export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useStore()
  const [editing, setEditing] = useState<Product | null>(null)
  const confirm = useConfirm()
  const [filter, setFilter] = useState('')

  function handleSubmit(input: ProductInput) {
    if (editing) {
      updateProduct(editing.id, input)
      setEditing(null)
    } else {
      addProduct(input)
    }
  }

  async function handleDelete(product: Product) {
    const ok = await confirm({
      title: 'Ürün silinsin mi?',
      message: (
        <>
          <strong className="text-stone-900">{product.name}</strong> kalıcı olarak silinecek ve sepetlerden çıkarılacak.
        </>
      ),
      confirmText: 'Evet, sil',
      tone: 'danger',
      icon: 'trash',
    })
    if (ok) {
      deleteProduct(product.id)
      if (editing?.id === product.id) setEditing(null)
    }
  }

  async function handleReset() {
    const ok = await confirm({
      title: 'Örnek veriler yüklensin mi?',
      message: 'Mevcut tüm ürünler silinip yerine örnek ürünler yüklenecek. Yaptığınız değişiklikler kaybolur.',
      confirmText: 'Evet, yükle',
      tone: 'danger',
      icon: 'reset',
    })
    if (ok) {
      resetProducts()
      setEditing(null)
    }
  }

  function handleEdit(product: Product) {
    setEditing(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const listed = useMemo(() => {
    const q = filter.trim().toLocaleLowerCase('tr')
    return products.filter((p) => `${p.name} ${p.category}`.toLocaleLowerCase('tr').includes(q))
  }, [products, filter])

  const stats = [
    { icon: BoxIcon, label: 'Toplam ürün', value: String(products.length), color: 'bg-sky-50 text-sky-600' },
    {
      icon: ChartIcon,
      label: 'Stok değeri',
      value: formatPrice(products.reduce((sum, p) => sum + p.price * p.stock, 0)),
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: TagIcon,
      label: 'İndirimli ürün',
      value: String(products.filter((p) => discountPercent(p) > 0).length),
      color: 'bg-brand-50 text-brand-600',
    },
    {
      icon: AlertIcon,
      label: 'Tükenen / azalan',
      value: `${products.filter((p) => p.stock === 0).length} / ${products.filter((p) => p.stock > 0 && p.stock <= 5).length}`,
      color: 'bg-red-50 text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">Yönetim paneli</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-stone-900">Ürünler</h1>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
        >
          <ResetIcon /> Örnek verileri yükle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[380px_1fr]">
        <div className="xl:sticky xl:top-36">
          <ProductForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4">
            <h2 className="px-2 font-extrabold text-stone-900">Ürün listesi ({listed.length})</h2>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Listede ara"
                className="rounded-full bg-stone-100 py-2 pr-4 pl-9 text-sm outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>

          {listed.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="📦"
                title={products.length === 0 ? 'Henüz ürün yok' : 'Eşleşen ürün yok'}
                description={products.length === 0 ? 'Formu kullanarak ilk ürününüzü ekleyin.' : 'Farklı bir arama deneyin.'}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-bold tracking-wide text-stone-400 uppercase">
                  <tr>
                    <th className="px-6 py-3">Ürün</th>
                    <th className="px-4 py-3 text-right">Fiyat</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-6 py-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {listed.map((p) => {
                    const discount = discountPercent(p)
                    return (
                      <tr key={p.id} className={editing?.id === p.id ? 'bg-brand-50' : 'transition hover:bg-stone-50'}>
                        <td className="px-6 py-3">
                          <Link to={`/urun/${p.id}`} className="flex items-center gap-3">
                            <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                              <ProductImage product={p} className="h-full w-full" emojiSize="text-xl" />
                            </span>
                            <span>
                              <span className="block font-bold text-stone-900 hover:text-brand-600">{p.name}</span>
                              <span className="text-xs text-stone-500">{p.category}</span>
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="block font-bold text-stone-900">{formatPrice(p.price)}</span>
                          {discount > 0 && (
                            <span className="text-xs font-semibold text-brand-600">
                              %{discount} · <span className="text-stone-400 line-through">{formatPrice(p.oldPrice!)}</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 font-semibold tabular-nums">{p.stock}</span>
                            <StockBadge stock={p.stock} />
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(p)}
                              className="rounded-full p-2.5 text-lg text-stone-500 transition hover:bg-stone-900 hover:text-white"
                              title="Düzenle"
                              aria-label={`${p.name} düzenle`}
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="rounded-full p-2.5 text-lg text-stone-500 transition hover:bg-red-500 hover:text-white"
                              title="Sil"
                              aria-label={`${p.name} sil`}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
  color: string
}

function StatCard({ icon: Icon, label, value, color }: StatProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${color}`}>
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-stone-500">{label}</p>
        <p className="truncate text-xl font-extrabold text-stone-900">{value}</p>
      </div>
    </div>
  )
}
