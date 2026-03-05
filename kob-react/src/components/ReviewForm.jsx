import React, { useState } from 'react'
import { Button, Alert, Card } from './ui'

/**
 * ReviewForm Component
 * Allow buyers to leave reviews for products they've purchased
 */
export default function ReviewForm({ productId, sellerId, buyerId, buyerName, onSubmit, loading }) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!text.trim()) {
      setError('Please write your review')
      return
    }

    if (text.length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    try {
      await onSubmit({
        productId,
        sellerId,
        buyerId,
        rating,
        text,
        buyerName,
      })
      setSubmitted(true)
      setText('')
      setRating(5)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    }
  }

  return (
    <Card variant="elevated" className="p-6 rounded-lg">
      <h3 className="text-lg font-bold text-kob-dark mb-4">Share Your Experience</h3>

      {submitted && (
        <Alert type="success" className="mb-4">
          Thank you! Your review has been posted.
        </Alert>
      )}

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-kob-dark mb-2">
            Rating (1-5 stars)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-opacity ${
                  star <= rating ? 'opacity-100' : 'opacity-30'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-semibold text-kob-dark mb-2">
            Your Review
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell others about your experience with this product..."
            rows="5"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kob-primary"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">{text.length} characters</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? '⏳ Submitting...' : '✓ Post Review'}
        </Button>
      </form>
    </Card>
  )
}
