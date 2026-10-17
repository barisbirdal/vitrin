import { useEffect, useState } from 'react'
import type { Product } from '../interfaces/product'
import { CATEGORY_STYLE } from '../utils/format'

interface Props {
  product: Pick<Product, 'name' | 'image' | 'category'>
  className?: string
  emojiSize?: string
}

// Ürün görseli: URL varsa resmi, yoksa (veya yüklenemezse) kategori simgesini gösterir
export default function ProductImage({ product, className = '', emojiSize = 'text-6xl' }: Props) {
  const [failed, setFailed] = useState(false)
  const style = CATEGORY_STYLE[product.category]

  // Görsel adresi değişirse yeniden denemeye izin ver
  useEffect(() => setFailed(false), [product.image])

  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`flex items-center justify-center ${style.bg} ${className}`} aria-label={product.name}>
      <span className={emojiSize}>{style.emoji}</span>
    </div>
  )
}
