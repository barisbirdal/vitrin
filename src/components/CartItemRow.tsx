import { Link } from 'react-router-dom'
import type { Product } from '../interfaces/product'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import ProductImage from './ProductImage'
import QuantityStepper from './QuantityStepper'
import { TrashIcon } from './Icons'

export default function CartItemRow({ product, quantity }: { product: Product; quantity: number }) {
  const { updateCartQuantity, removeFromCart } = useStore()

  return (
    <li className="flex gap-4 p-4 sm:gap-5 sm:p-5">
      <Link to={`/urun/${product.id}`} className="shrink-0 overflow-hidden rounded-2xl bg-stone-100">
        <ProductImage product={product} className="h-24 w-24 sm:h-28 sm:w-28" emojiSize="text-4xl" />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-500">{product.category}</p>
            <Link to={`/urun/${product.id}`} className="font-bold text-stone-900 hover:text-brand-600">
              {product.name}
            </Link>
            <p className="text-sm text-stone-500">{formatPrice(product.price)} / adet</p>
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="rounded-full p-2 text-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Sepetten çıkar"
            title="Sepetten çıkar"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantityStepper
            value={quantity}
            onChange={(v) => updateCartQuantity(product.id, v)}
            max={product.stock}
          />
          <span className="text-lg font-extrabold text-stone-900">{formatPrice(product.price * quantity)}</span>
        </div>
      </div>
    </li>
  )
}
