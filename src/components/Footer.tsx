import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../interfaces/product'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed">
            Elektronikten giyime, evden spora; ihtiyacınız olan her şey tek vitrinde. Güvenli alışverişin keyfini çıkarın.
          </p>
        </div>

        <FooterColumn title="Kategoriler">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/?kategori=${encodeURIComponent(c)}#urunler`} className="hover:text-white">
              {c}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title="Hesabım">
          <Link to="/sepet" className="hover:text-white">Sepetim</Link>
          <Link to="/yonetim" className="hover:text-white">Ürün yönetimi</Link>
        </FooterColumn>

        <FooterColumn title="İletişim">
          <span>destek@vitrin.example</span>
          <span>0850 000 00 00</span>
          <span>Hafta içi 09:00 - 18:00</span>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row">
          <span>© 2026 Vitrin. Eğitim amaçlı geliştirilmiş bir projedir.</span>
          <span>React · TypeScript · Tailwind CSS · LocalStorage</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold tracking-wide text-white">{title}</h3>
      <div className="flex flex-col gap-2.5 text-sm">{children}</div>
    </div>
  )
}
