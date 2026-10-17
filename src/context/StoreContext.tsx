import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Product, ProductInput } from '../interfaces/product'
import type { CartItem } from '../interfaces/cart'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { SEED_PRODUCTS } from '../data/seedProducts'

const PRODUCTS_KEY = 'vitrin:products'
const CART_KEY = 'vitrin:cart'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface StoreContextValue {
  // Ürünler (yönetim paneli CRUD)
  products: Product[]
  addProduct: (input: ProductInput) => void
  updateProduct: (id: string, input: ProductInput) => void
  deleteProduct: (id: string) => void
  resetProducts: () => void

  // Sepet (CRUD)
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (productId: string, quantity?: number) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  checkout: () => void

  // Bildirimler
  toasts: Toast[]
  notify: (message: string, type?: Toast['type']) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage(PRODUCTS_KEY, SEED_PRODUCTS),
  )
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage(CART_KEY, []))
  const [toasts, setToasts] = useState<Toast[]>([])

  // Her değişiklikte LocalStorage'a kaydet
  useEffect(() => saveToStorage(PRODUCTS_KEY, products), [products])
  useEffect(() => saveToStorage(CART_KEY, cart), [cart])

  // Silinen ürünleri sepetten temizle, miktarı stokla sınırla
  useEffect(() => {
    setCart((prev) => {
      const next = prev
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product || product.stock === 0) return null
          return { ...item, quantity: Math.min(item.quantity, product.stock) }
        })
        .filter((item): item is CartItem => item !== null)
      const changed =
        next.length !== prev.length || next.some((item, i) => item.quantity !== prev[i].quantity)
      return changed ? next : prev
    })
  }, [products])

  function notify(message: string, type: Toast['type'] = 'success') {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500)
  }

  // ---- Ürün işlemleri ----
  function addProduct(input: ProductInput) {
    const product: Product = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [product, ...prev])
    notify(`"${product.name}" eklendi`)
  }

  function updateProduct(id: string, input: ProductInput) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...input } : p)))
    notify(`"${input.name}" güncellendi`)
  }

  function deleteProduct(id: string) {
    const product = products.find((p) => p.id === id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (product) notify(`"${product.name}" silindi`, 'info')
  }

  function resetProducts() {
    setProducts(SEED_PRODUCTS)
    notify('Örnek ürünler geri yüklendi', 'info')
  }

  // ---- Sepet işlemleri ----
  function addToCart(productId: string, quantity = 1) {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    const inCart = cart.find((i) => i.productId === productId)?.quantity ?? 0
    if (inCart + quantity > product.stock) {
      notify(`Stokta yalnızca ${product.stock} adet var`, 'error')
      return
    }
    setCart((prev) =>
      inCart > 0
        ? prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
        : [...prev, { productId, quantity }],
    )
    notify(`"${product.name}" sepete eklendi`)
  }

  function updateCartQuantity(productId: string, quantity: number) {
    const product = products.find((p) => p.id === productId)
    if (!product) return
    if (quantity < 1) return removeFromCart(productId)
    if (quantity > product.stock) {
      notify(`Stokta yalnızca ${product.stock} adet var`, 'error')
      return
    }
    setCart((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
    notify('Ürün sepetten çıkarıldı', 'info')
  }

  // Siparişi tamamla: stokları düş, sepeti boşalt
  function checkout() {
    setProducts((prev) =>
      prev.map((p) => {
        const item = cart.find((i) => i.productId === p.id)
        return item ? { ...p, stock: p.stock - item.quantity } : p
      }),
    )
    setCart([])
    notify('Siparişiniz alındı, teşekkürler! 🎉')
  }

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const product = products.find((p) => p.id === i.productId)
        return sum + (product ? product.price * i.quantity : 0)
      }, 0),
    [cart, products],
  )

  const value: StoreContextValue = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    checkout,
    toasts,
    notify,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore, StoreProvider içinde kullanılmalı')
  return ctx
}
