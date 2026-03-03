import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import { getSellerReviews, calculateSellerRating } from '../services/reviews'

/**
 * SellerRating Component
 * Display seller's aggregated rating and review count
 */
export default function SellerRating({ sellerId, sellerName = 'Seller', compact = false }) {
  const [rating, setRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sellerId) return

    setLoading(true)
    getSellerReviews(sellerId)
      .then((reviews) => {
        const avgRating = calculateSellerRating(reviews)
        setRating(avgRating)
        setReviewCount(reviews.length)
        setError(null)
      })
      .catch((err) => {
        console.error('Error fetching seller reviews:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [sellerId])

  if (loading) {
    return (
      <div className={compact ? 'inline-flex gap-2 items-center' : ''}>
        <div className="text-sm text-gray-500">Loading rating...</div>
      </div>
    )
  }

  if (error) {
    return <div className="text-xs text-red-600">Unable to load rating</div>
  }

  const displayRating = rating.toFixed(1)

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.ceil(rating) ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>
              ⭐
            </span>
          ))}
        </div>
        <span className="font-bold text-yellow-800 text-sm">{displayRating}</span>
        <span className="text-xs text-yellow-700">({reviewCount})</span>
      </div>
    )
  }

  return (
    <Card variant="elevated" className="p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-white">
      <div className="flex items-center gap-6">
        {/* Rating Circle */}
        <div className="text-center flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-800">{displayRating}</div>
              <div className="text-xs text-yellow-700 font-semibold">★★★★★</div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xl font-bold text-kob-dark mb-2">Seller Rating</h3>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.ceil(rating) ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}>
                ⭐
              </span>
            ))}
          </div>
          <p className="text-gray-700">
            <span className="font-bold text-kob-primary">{reviewCount}</span> reviews from satisfied buyers
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {rating >= 4.5 && '⭐ Excellent seller - Highly recommended'}
            {rating >= 4 && rating < 4.5 && '⭐ Great seller - Very reliable'}
            {rating >= 3 && rating < 4 && '⭐ Good seller - Worth trying'}
            {rating >= 2 && rating < 3 && '⭐ Fair seller - Mixed reviews'}
            {rating < 2 && '⭐ Needs improvement - Few positive reviews'}
          </p>
        </div>
      </div>

      {/* Trust Badge */}
      {rating >= 4.5 && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-100 rounded border border-green-300">
          <span className="text-lg">✓</span>
          <span className="text-sm font-semibold text-green-800">Trusted Seller Badge</span>
        </div>
      )}
    </Card>
  )
}
