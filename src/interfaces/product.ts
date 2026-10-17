export interface Product {
  id: string
  name: string
  description: string
  price: number
  oldPrice?: number // Doluysa ve fiyattan büyükse ürün indirimli gösterilir
  category: Category
  stock: number
  image: string // Boş bırakılırsa kategori simgesi gösterilir
  createdAt: string
}

// Ekleme/güncelleme formundan gelen veri (id ve tarih otomatik atanır)
export type ProductInput = Omit<Product, 'id' | 'createdAt'>

export const CATEGORIES = [
  'Elektronik',
  'Giyim',
  'Ev & Yaşam',
  'Kitap',
  'Spor',
  'Kozmetik',
] as const

export type Category = (typeof CATEGORIES)[number]
