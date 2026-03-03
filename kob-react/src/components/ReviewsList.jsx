import React from 'react'
import { Card } from '../ui'

/**
 * ReviewsList Component
 * Display all reviews for a product
 */
export default function ReviewsList({ reviews = [], averageRating = 0, productTitle }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card variant="outlined" className="p-8 rounded-lg text-center">
        <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card variant="elevated" className="p-6 rounded-lg bg-gradient-to-br from-kob-light to-white">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-kob-primary mb-2">{averageRating}</div>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.ceil(averageRating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{reviews.length} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} variant="outlined" className="p-6 rounded-lg">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-kob-dark">{review.buyerName || 'Anonymous'}</h4>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 leading-relaxed">{review.text}</p>

            {/* Rating Badge */}
            <div className="mt-4 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              {review.rating} / 5 stars
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
