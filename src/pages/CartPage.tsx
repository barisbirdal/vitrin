import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../utils/format'
import CartItemRow from '../components/CartItemRow'
import EmptyState from '../components/EmptyState'
import { useConfirm } from '../components/ConfirmDialog'
import { ArrowRightIcon, ShieldIcon, TruckIcon } from '../components/Icons'

const FREE_SHIPPING_LIMIT = 1000
const SHIPPING_FEE = 59.9

export default function CartPage() {
  const { cart, products, cartTotal, cartCount, checkout } = useStore()
  const confirm = useConfirm()

  if (cart.length === 0) {
    return (
      <EmptyState
        icon="🛍️"
        title="Sepetiniz boş"
        description="Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın."
        action={
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white hover:bg-brand-600"
          >
            Alışverişe başla <ArrowRightIcon />
          </Link>
        }
      />
    )
  }

  const shipping = cartTotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE
  const progress = Math.min(100, (cartTotal / FREE_SHIPPING_LIMIT) * 100)
  const savings = cart.reduce((sum, i) => {
    const p = products.find((x) => x.id === i.productId)
    return p?.oldPrice && p.oldPrice > p.price ? sum + (p.oldPrice - p.price) * i.quantity : sum
  }, 0)

  async function handleCheckout() {
    const ok = await confirm({
      title: 'Siparişi onaylıyor musunuz?',
      message: (
        <>
          {cartCount} ürün için toplam{' '}
          <strong className="text-stone-900">{formatPrice(cartTotal + shipping)}</strong> ödenecek.
        </>
      ),
      confirmText: 'Siparişi onayla',
      tone: 'primary',
      icon: 'bag',
    })
    if (ok) checkout()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Sepetim</h1>
        <p className="text-sm text-stone-500">{cartCount} ürün</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-stone-200">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <TruckIcon className="text-xl text-brand-600" />
              {shipping === 0 ? (
                <span className="text-emerald-700">Tebrikler! Kargonuz ücretsiz 🎉</span>
              ) : (
                <span>
                  Ücretsiz kargo için <span className="text-brand-600">{formatPrice(FREE_SHIPPING_LIMIT - cartTotal)}</span> daha ekleyin
                </span>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${shipping === 0 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-stone-100 rounded-2xl bg-white ring-1 ring-stone-200">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              return product ? <CartItemRow key={item.productId} product={product} quantity={item.quantity} /> : null
            })}
          </ul>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl bg-white p-6 ring-1 ring-stone-200 lg:sticky lg:top-36">
          <h2 className="text-lg font-extrabold text-stone-900">Sipariş özeti</h2>
          <div className="space-y-3">
            <Row label="Ürünler" value={formatPrice(cartTotal)} />
            <Row label="Kargo" value={shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)} highlight={shipping === 0} />
            {savings > 0 && <Row label="İndirim kazancınız" value={`-${formatPrice(savings)}`} highlight />}
          </div>
          <div className="flex items-baseline justify-between border-t border-dashed border-stone-200 pt-4">
            <span className="font-bold text-stone-900">Toplam</span>
            <span className="text-2xl font-extrabold text-stone-900">{formatPrice(cartTotal + shipping)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-4 font-bold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
          >
            Siparişi tamamla <ArrowRightIcon />
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldIcon className="text-base" /> Ödemeleriniz 256-bit SSL ile korunur
          </p>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-stone-500">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-emerald-600' : 'text-stone-900'}`}>{value}</span>
    </div>
  )
}
