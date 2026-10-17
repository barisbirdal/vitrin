import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import { ConfirmProvider } from './components/ConfirmDialog'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

// #urunler gibi bağlantılarda ilgili bölüme git, başka sayfaya geçince en üste kaydır.
// Yalnızca filtre (kategori, arama) değiştiğinde kaydırma konumuna dokunma.
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else if (pathname !== prevPathname.current) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    prevPathname.current = pathname
  }, [pathname, hash, key])
  return null
}

export default function App() {
  return (
    <StoreProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <ScrollManager />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/urun/:id" element={<ProductDetailPage />} />
                <Route path="/sepet" element={<CartPage />} />
                <Route path="/yonetim" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toasts />
          </div>
        </BrowserRouter>
      </ConfirmProvider>
    </StoreProvider>
  )
}
