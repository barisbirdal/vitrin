import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

export default function NotFoundPage() {
  return (
    <EmptyState
      icon="🧭"
      title="Sayfa bulunamadı"
      description="Aradığınız sayfa taşınmış veya hiç var olmamış olabilir."
      action={<Link to="/" className="text-sm font-semibold text-brand-600 hover:underline">Ana sayfaya dön</Link>}
    />
  )
}
