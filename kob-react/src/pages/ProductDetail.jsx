import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Button, Alert } from '../components/ui'
import BackButton from '../components/BackButton'
import ReviewForm from '../components/ReviewForm'
import ReviewsList from '../components/ReviewsList'
import SellerRatingDisplay from '../components/SellerRatingDisplay'
import { getProductById } from '../services/products'
import { getProductReviews, calculateAverageRating } from '../services/reviews'
import { useAuth } from '../firebase/auth'
import { createOrGetConversation } from '../services/chat'

export default function ProductDetail() {
  const { productId } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!productId) {
        setError('Product ID not found')
        setLoading(false)
        return
      }

      try {
        // Load product
        const productData = await getProductById(productId)
        if (!productData) {
          setError('Product not found')
          setLoading(false)
          return
        }
        setProduct(productData)

        // Load reviews
        const reviewsData = await getProductReviews(productId)
        setReviews(reviewsData)
        const avgRating = calculateAverageRating(reviewsData)
        setAverageRating(avgRating)

        setError(null)
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [productId])

  const handleContactSeller = async () => {
    if (!user) {
      alert('Please login to contact the seller')
      window.location.href = '/login'
      return
    }

    try {
      const conversationId = await createOrGetConversation(user.uid, product.sellerId, productId)
      // Navigate to messages tab in dashboard
      window.location.href = '/dashboard?tab=messages&conversation=' + conversationId
    } catch (err) {
      console.error('Error creating conversation:', err)
      alert('Failed to start conversation')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-kob-light">
        <div className="container py-4">
          <BackButton />
        </div>
        <div className="container py-12 text-center">
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-kob-light">
        <div className="container py-4">
          <BackButton />
        </div>
        <div className="container py-8">
          <Alert type="error" title="Error" message={error || 'Product not found'} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Main Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image & Title */}
            <Card variant="elevated" className="p-6 rounded-lg">
              {product.imageURL && (
                <div className="mb-6">
                  <img
                    src={product.imageURL}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              <h1 className="text-4xl font-bold text-kob-dark mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-kob-primary">₦{product.price?.toLocaleString()}</div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.ceil(averageRating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
              </div>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>

              {product.category && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-kob-light text-kob-primary rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>
              )}
            </Card>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b-2 border-gray-200 overflow-x-auto">
              {[
                { id: 'details', label: '📋 Details' },
                { id: 'reviews', label: `⭐ Reviews (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'text-kob-primary border-b-4 border-kob-primary' : 'text-gray-600 hover:text-kob-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <Card variant="outlined" className="p-6 rounded-lg space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-kob-dark mb-3">Product Information</h3>
                  <dl className="space-y-3">
                    {product.quantity && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Stock Available</dt>
                        <dd className="font-semibold text-kob-primary">{product.quantity} units</dd>
                      </div>
                    )}
                    {product.location && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Location</dt>
                        <dd className="font-semibold text-kob-dark">{product.location}</dd>
                      </div>
                    )}
                    {product.condition && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Condition</dt>
                        <dd className="font-semibold text-kob-dark">{product.condition}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Posted</dt>
                      <dd className="font-semibold text-kob-dark">
                        {new Date(product.createdAt?.toDate?.() || product.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {user && user.uid !== product.sellerId && (
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="w-full"
                    size="lg"
                  >
                    {showReviewForm ? 'Cancel' : '✍️ Leave a Review'}
                  </Button>
                )}

                {showReviewForm && user && user.uid !== product.sellerId && (
                  <ReviewForm
                    productId={productId}
                    productTitle={product.title}
                    sellerId={product.sellerId}
                    buyerId={user.uid}
                    buyerName={user.email?.split('@')[0]}
                    onSubmit={(newReview) => {
                      setReviews([newReview, ...reviews])
                      setShowReviewForm(false)
                      const avgRating = calculateAverageRating([newReview, ...reviews])
                      setAverageRating(avgRating)
                    }}
                  />
                )}

                <ReviewsList reviews={reviews} averageRating={averageRating} productTitle={product.title} />
              </div>
            )}
          </div>

          {/* Sidebar - Seller Info & Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card variant="elevated" className="p-6 rounded-lg">
              <h3 className="font-bold text-lg text-kob-dark mb-4">👤 Seller Information</h3>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Seller</p>
                <p className="font-bold text-kob-primary">{product.sellerName || product.sellerId}</p>
              </div>

              {/* Seller Rating */}
              <div className="mb-6">
                <SellerRatingDisplay sellerId={product.sellerId} sellerName={product.sellerName} compact={true} />
              </div>

              {/* Contact & Purchase Buttons */}
              <div className="space-y-3">
                <Button onClick={handleContactSeller} variant="primary" className="w-full" size="lg">
                  💬 Contact Seller
                </Button>

                <Button
                  onClick={() => {
                    alert('Order functionality coming soon!')
                  }}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  🛒 Place Order
                </Button>

                <Button
                  onClick={() => {
                    window.open(`https://wa.me/${product.sellerPhone || 'seller'}?text=Interested%20in%20${product.title}`, '_blank')
                  }}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  📱 WhatsApp Seller
                </Button>
              </div>
            </Card>

            {/* Share Card */}
            <Card variant="outlined" className="p-6 rounded-lg">
              <h3 className="font-bold text-lg text-kob-dark mb-4">📤 Share</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.title,
                        text: product.description,
                        url: window.location.href,
                      })
                    }
                  }}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Share Product
                </Button>
              </div>
            </Card>

            {/* Report Card */}
            <Card variant="outlined" className="p-6 rounded-lg bg-red-50">
              <button className="text-red-700 font-semibold text-sm hover:underline">🚩 Report Product</button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
