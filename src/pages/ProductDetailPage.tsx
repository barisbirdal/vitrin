import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { discountPercent, formatPrice } from '../utils/format'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import StockBadge from '../components/StockBadge'
import EmptyState from '../components/EmptyState'
import QuantityStepper from '../components/QuantityStepper'
import { BagIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products, addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const product = products.find((p) => p.id === id)

  // Başka bir ürüne geçildiğinde adedi sıfırla
  useEffect(() => setQuantity(1), [id])

  if (!product) {
    return (
      <EmptyState
        icon="📦"
        title="Ürün bulunamadı"
        description="Bu ürün kaldırılmış veya hiç var olmamış olabilir."
        action={<Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">Mağazaya dön</Link>}
      />
    )
  }

  const discount = discountPercent(product)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-stone-500" aria-label="Sayfa yolu">
          <Link to="/" className="hover:text-stone-900">Ana sayfa</Link>
          <span>/</span>
          <Link to={`/?kategori=${encodeURIComponent(product.category)}#urunler`} className="hover:text-stone-900">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-stone-900">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative overflow-hidden rounded-[2rem] bg-stone-100">
            <ProductImage product={product} className="aspect-square w-full" emojiSize="text-9xl" />
            {discount > 0 && (
              <span className="absolute top-5 left-5 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-bold text-white">
                %{discount} indirim
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:py-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tracking-wider text-brand-600 uppercase">{product.category}</span>
                <StockBadge stock={product.stock} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-stone-900">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-stone-400 line-through">{formatPrice(product.oldPrice!)}</span>
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-700">
                    {formatPrice(product.oldPrice! - product.price)} kazanç
                  </span>
                </>
              )}
            </div>

            <p className="leading-relaxed text-stone-600">{product.description || 'Açıklama eklenmemiş.'}</p>

            {product.stock > 0 ? (
              <div className="flex flex-wrap items-center gap-3 border-y border-stone-200 py-6">
                <QuantityStepper
                  value={quantity}
                  onChange={(v) => setQuantity(Math.max(1, Math.min(v, product.stock)))}
                  max={product.stock}
                  size="lg"
                />
                <button
                  onClick={() => addToCart(product.id, quantity)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-4 font-bold text-white transition hover:bg-brand-500"
                >
                  <BagIcon className="text-xl" /> Sepete ekle
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-stone-100 px-5 py-4 text-sm font-semibold text-stone-600">
                Bu ürün şu anda stokta yok.
              </div>
            )}

            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: TruckIcon, text: 'Yarın kargoda' },
                { icon: ReturnIcon, text: '14 gün ücretsiz iade' },
                { icon: ShieldIcon, text: '2 yıl garanti' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-sm font-semibold ring-1 ring-stone-200">
                  <Icon className="text-xl text-brand-600" /> {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Benzer ürünler</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
