import React, { useState, useEffect, useCallback } from 'react'
import { Card, Button, Textarea, Alert } from '../ui'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

/**
 * ProductReviews Component
 * Display and manage product reviews with ratings
 * 
 * Props:
 *   - productId: ID of the product
 *   - user: Current authenticated user
 *   - onRatingChange: Callback when average rating updates
 */
export default function ProductReviews({
  productId,
  user = null,
  onRatingChange = () => {},
}) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [userReview, setUserReview] = useState(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReviews(data)

      // Check if current user has already reviewed
      const userRev = data.find((r) => r.userId === user?.uid)
      setUserReview(userRev || null)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [productId, user])

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Calculate and notify of rating changes
  useEffect(() => {
    if (reviews.length > 0) {
      const avgRating = (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
      onRatingChange(avgRating)
    }
  }, [reviews, onRatingChange])

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to leave a review')
      return
    }

    if (!reviewText.trim()) {
      setError('Please write a review')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const reviewData = {
        productId,
        userId: user.uid,
        userName: user.email.split('@')[0],
        rating,
        text: reviewText,
        createdAt: serverTimestamp(),
      }

      if (userReview) {
        // Update existing review
        const ref = doc(db, 'reviews', userReview.id)
        await updateDoc(ref, reviewData)
      } else {
        // Create new review
        await addDoc(collection(db, 'reviews'), reviewData)
      }

      // Reset form
      setRating(5)
      setReviewText('')
      setShowForm(false)

      // Refresh reviews
      await fetchReviews()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!confirm('Delete this review?')) return

    try {
      await deleteDoc(doc(db, 'reviews', reviewId))
      await fetchReviews()
    } catch (err) {
      setError(err.message)
    }
  }

  function renderStars(count) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= count ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-kob-dark mb-2">⭐ Reviews</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-kob-primary">{avgRating}</span>
                <div className="flex gap-0.5">
                  {renderStars(Math.round(avgRating))}
                </div>
              </div>
              <p className="text-sm text-gray-600">({reviews.length} reviews)</p>
            </div>
          </div>

          {user && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="primary"
            >
              {userReview ? '✏️ Edit Review' : '➕ Leave Review'}
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        {/* Review Form */}
        {showForm && (
          <Card variant="outlined" className="p-4 bg-blue-50">
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className={`text-3xl transition-colors ${
                        i <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                label="Your Review"
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                maxLength={500}
              />

              <div className="text-xs text-gray-500">
                {reviewText.length}/500 characters
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting || !reviewText.trim()}
                >
                  {submitting ? '⏳ Submitting...' : '✓ Submit Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} variant="outlined" className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{review.userName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt?.toDate?.() || new Date()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {user?.uid === review.userId && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{review.text}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
            {user && (
              <Button
                onClick={() => setShowForm(true)}
                variant="primary"
              >
                ⭐ Write First Review
              </Button>
            )}
          </div>
        )}

        {!user && reviews.length > 0 && (
          <div className="text-center py-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <a href="/login" className="font-semibold hover:underline">
                Log in
              </a>{' '}
              to leave your own review
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
