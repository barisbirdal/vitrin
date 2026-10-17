import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { CATEGORIES, type Product, type ProductInput } from '../interfaces/product'
import ProductImage from './ProductImage'
import { EditIcon, PlusIcon } from './Icons'

interface Props {
  editing: Product | null // null => yeni ürün ekleme modu
  onSubmit: (input: ProductInput) => void
  onCancel: () => void
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  oldPrice: '',
  category: CATEGORIES[0] as string,
  stock: '',
  image: '',
}

type FormState = typeof EMPTY_FORM
type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (form.name.trim().length < 2) errors.name = 'Ürün adı en az 2 karakter olmalı'
  const price = Number(form.price)
  if (form.price === '' || Number.isNaN(price) || price <= 0) errors.price = 'Geçerli bir fiyat girin'
  if (form.oldPrice !== '' && !(Number(form.oldPrice) > price)) errors.oldPrice = 'Eski fiyat, satış fiyatından büyük olmalı'
  const stock = Number(form.stock)
  if (form.stock === '' || !Number.isInteger(stock) || stock < 0) errors.stock = 'Stok 0 veya pozitif tam sayı olmalı'
  if (form.image && !/^https?:\/\//.test(form.image.trim())) errors.image = 'Görsel adresi http(s):// ile başlamalı'
  return errors
}

const inputClass =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100'

export default function ProductForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Errors>({})

  // Düzenleme moduna geçildiğinde formu ürün bilgileriyle doldur
  useEffect(() => {
    setErrors({})
    setForm(
      editing
        ? {
            name: editing.name,
            description: editing.description,
            price: String(editing.price),
            oldPrice: editing.oldPrice ? String(editing.oldPrice) : '',
            category: editing.category,
            stock: String(editing.stock),
            image: editing.image,
          }
        : EMPTY_FORM,
    )
  }, [editing])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    const round = (v: string) => Math.round(Number(v) * 100) / 100
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: round(form.price),
      oldPrice: form.oldPrice ? round(form.oldPrice) : undefined,
      category: form.category as ProductInput['category'],
      stock: Number(form.stock),
      image: form.image.trim(),
    })
    if (!editing) setForm(EMPTY_FORM)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-4 rounded-3xl bg-white p-6 ring-1 transition ${editing ? 'ring-2 ring-brand-400' : 'ring-stone-200'}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
            editing ? 'bg-brand-500 text-white' : 'bg-stone-900 text-white'
          }`}
        >
          {editing ? <EditIcon /> : <PlusIcon />}
        </span>
        <div>
          <h2 className="font-extrabold text-stone-900">{editing ? 'Ürünü güncelle' : 'Yeni ürün ekle'}</h2>
          <p className="text-xs text-stone-500">{editing ? editing.name : 'Bilgileri doldurup kaydedin'}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl bg-stone-100">
          <ProductImage
            product={{ name: form.name, image: form.image, category: form.category as ProductInput['category'] }}
            className="h-full w-full"
            emojiSize="text-3xl"
          />
        </div>
        <Field label="Ürün adı" error={errors.name}>
          <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Örn. Kablosuz Mouse" />
        </Field>
      </div>

      <Field label="Açıklama">
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Ürünün kısa açıklaması"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Satış fiyatı (₺)" error={errors.price}>
          <input className={inputClass} type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="0,00" />
        </Field>
        <Field label="Eski fiyat (₺)" hint="İndirim için" error={errors.oldPrice}>
          <input className={inputClass} type="number" min="0" step="0.01" value={form.oldPrice} onChange={(e) => update('oldPrice', e.target.value)} placeholder="İsteğe bağlı" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stok" error={errors.stock}>
          <input className={inputClass} type="number" min="0" step="1" value={form.stock} onChange={(e) => update('stock', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Kategori">
          <select className={inputClass} value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Görsel adresi" hint="İsteğe bağlı" error={errors.image}>
        <input className={inputClass} value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
      </Field>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 rounded-full bg-stone-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-500">
          {editing ? 'Değişiklikleri kaydet' : 'Ürünü ekle'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-3 text-sm font-bold text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50">
            Vazgeç
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block flex-1 space-y-1.5">
      <span className="flex items-baseline justify-between text-xs font-bold text-stone-700">
        {label}
        {hint && <span className="font-medium text-stone-400">{hint}</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
