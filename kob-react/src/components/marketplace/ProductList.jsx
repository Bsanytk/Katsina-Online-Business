import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { Card, Button } from '../ui'
import ProductCard from '../ProductCard'
import Loading from '../Loading'

/**
 * ProductList Component
 * Displays products in a responsive grid with pagination
 * Features lazy-loaded images and verified seller badges
 * 
 * Props:
 *   - products: Array of product objects
 *   - loading: Boolean indicating loading state
 *   - error: String error message or null
 *   - onEdit: Callback when edit button is clicked
 *   - onDelete: Callback when delete button is clicked
 *   - user: Current authenticated user
 *   - itemsPerPage: Number of products per page (default: 12)
 */
export default function ProductList({
  products = [],
  loading = false,
  error = null,
  onEdit = null,
  onDelete = null,
  user = null,
  itemsPerPage = 12,
}) {
  const t = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  // Reset to page 1 when products change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length])

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <Loading message={t('productList.loadingProducts')} />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Card variant="elevated" className="p-6 border-l-4 border-red-500 bg-red-50">
        <h3 className="text-lg font-bold text-red-700 mb-2">⚠️ {t('productList.errorLoading')}</h3>
        <p className="text-red-600">{error}</p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          {t('productList.retry')}
        </Button>
      </Card>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <Card variant="elevated" className="p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-kob-dark mb-2">{t('productList.noProducts')}</h3>
        <p className="text-gray-600 mb-6">
          {t('productList.noProductsMessage')}
        </p>
        {user?.role === 'seller' && (
          <Button
            variant="primary"
            onClick={() => window.location.href = '/dashboard'}
          >
            Create Your First Product
          </Button>
        )}
      </Card>
    )
  }

  // Results info
  const resultsText = `${t('productList.pageInfo')
    .replace('{{current}}', currentPage)
    .replace('{{total}}', totalPages)} (${startIndex + 1}–${Math.min(endIndex, products.length)} of ${products.length})`

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">{resultsText}</p>
        {products.length > itemsPerPage && (
          <p className="text-sm text-gray-500">
            {t('productList.pageInfo')
              .replace('{{current}}', currentPage)
              .replace('{{total}}', totalPages)}
          </p>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            user={user}
            onEdit={onEdit}
            onDelete={onDelete}
            showVerifiedBadge={product.verified}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t('productList.previous')}
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-kob-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            {t('productList.next')}
          </Button>
        </div>
      )}
    </div>
  )
}
