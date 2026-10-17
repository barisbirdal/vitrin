import { Link } from 'react-router-dom'
import type { Product } from '../interfaces/product'
import { useStore } from '../context/StoreContext'
import { discountPercent, formatPrice, isNew } from '../utils/format'
import ProductImage from './ProductImage'
import { PlusIcon } from './Icons'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore()
  const discount = discountPercent(product)
  const soldOut = product.stock === 0

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-stone-100">
        <Link to={`/urun/${product.id}`} className="block">
          <ProductImage
            product={product}
            className={`aspect-[4/5] w-full transition duration-500 group-hover:scale-105 ${soldOut ? 'opacity-50 grayscale' : ''}`}
          />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">%{discount} indirim</span>
          )}
          {isNew(product) && !soldOut && (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-stone-900 shadow-sm">Yeni</span>
          )}
          {soldOut && <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-bold text-white">Tükendi</span>}
        </div>

        {!soldOut && (
          <button
            onClick={() => addToCart(product.id)}
            className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-stone-900 shadow-lg transition hover:bg-brand-500 hover:text-white md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            aria-label={`${product.name} sepete ekle`}
            title="Sepete ekle"
          >
            <PlusIcon />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
        <span className="text-xs font-semibold text-stone-500">{product.category}</span>
        <Link to={`/urun/${product.id}`} className="line-clamp-1 font-bold text-stone-900 hover:text-brand-600">
          {product.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className={`text-lg font-extrabold ${discount > 0 ? 'text-brand-600' : 'text-stone-900'}`}>
            {formatPrice(product.price)}
          </span>
          {discount > 0 && <span className="text-sm text-stone-400 line-through">{formatPrice(product.oldPrice!)}</span>}
        </div>
        {!soldOut && product.stock <= 5 && (
          <span className="text-xs font-semibold text-amber-600">Son {product.stock} ürün!</span>
        )}
      </div>
    </article>
  )
}
