import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'

// Buyer Dashboard View
function BuyerDashboard({ user }) {
  const [savedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch user's saved products from Firestore
    const loadData = async () => {
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card variant="elevated" className="bg-gradient-to-r from-kob-primary to-kob-gold text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.email.split('@')[0]}! 👋</h1>
        <p className="opacity-90">
          Browse, save, and purchase products from verified sellers across Katsina.
        </p>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">❤️</div>
          <p className="text-sm text-gray-600 font-semibold">Saved Products</p>
          <p className="text-3xl font-bold text-kob-primary">{savedProducts.length}</p>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm text-gray-600 font-semibold">Active Orders</p>
          <p className="text-3xl font-bold text-kob-primary">0</p>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-sm text-gray-600 font-semibold">My Reviews</p>
          <p className="text-3xl font-bold text-kob-primary">0</p>
        </Card>
      </div>

      {/* Saved Products Section */}
      <Card variant="elevated" className="p-6">
        <h2 className="text-2xl font-bold text-kob-dark mb-6 flex items-center gap-2">
          <span>❤️</span> Saved Products
        </h2>

        {loading ? (
          <Loading message="Loading saved products..." />
        ) : savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Products will be displayed here */}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 mb-4">No saved products yet.</p>
            <Button
              onClick={() => window.location.href = '/marketplace'}
              variant="primary"
              size="lg"
            >
              Browse Marketplace
            </Button>
          </div>
        )}
      </Card>

      {/* Resources */}
      <Card variant="outlined" className="p-6 bg-blue-50">
        <h3 className="text-lg font-bold text-kob-dark mb-4">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Save products to your favorites for easy access</li>
          <li>✓ Check seller ratings before making a purchase</li>
          <li>✓ Use WhatsApp to contact sellers directly</li>
          <li>✓ Read buyer reviews to make informed decisions</li>
        </ul>
      </Card>
    </div>
  )
}

// Seller Dashboard View
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoadingProducts(true)
    try {
      const items = await getProducts()
      setProducts(items)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  async function handleDelete(productId, productTitle) {
    if (!window.confirm(`Delete "${productTitle}"? This action cannot be undone.`)) return

    setDeleteLoading(productId)
    try {
      await deleteProduct(productId)
      setShowDeleteSuccess(true)
      await fetchProducts()
      setTimeout(() => setShowDeleteSuccess(false), 5000)
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card variant="elevated" className="bg-gradient-to-r from-kob-primary to-kob-gold text-white p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.email.split('@')[0]}! 👋</h1>
        <p className="opacity-90">
          ✓ You can manage your products and reach thousands of customers.
        </p>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-sm text-gray-600 font-semibold">Active Products</p>
          <p className="text-3xl font-bold text-kob-primary">{products.length}</p>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-sm text-gray-600 font-semibold">Total Views</p>
          <p className="text-3xl font-bold text-kob-primary">0</p>
        </Card>
        <Card variant="elevated" className="p-6">
          <div className="text-4xl mb-2">⭐</div>
          <p className="text-sm text-gray-600 font-semibold">Average Rating</p>
          <p className="text-3xl font-bold text-kob-primary">—</p>
        </Card>
      </div>

      {/* Delete Success Alert */}
      {showDeleteSuccess && (
        <Alert type="success" title="Product Deleted" onDismiss={() => setShowDeleteSuccess(false)}>
          Your product has been successfully deleted.
        </Alert>
      )}

      {/* Products Management Section */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-kob-dark flex items-center gap-2">
            <span>📦</span> My Products
          </h2>
          <Button
            onClick={() => window.location.href = '/marketplace'}
            variant="primary"
            size="md"
          >
            + Add Product
          </Button>
        </div>

        {loadingProducts ? (
          <Loading message="Loading your products..." />
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-kob-primary">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-kob-dark">Title</th>
                  <th className="text-left py-3 px-2 font-semibold text-kob-dark">Price</th>
                  <th className="text-left py-3 px-2 font-semibold text-kob-dark">Description</th>
                  <th className="text-center py-3 px-2 font-semibold text-kob-dark">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-medium text-kob-dark truncate">{product.title}</td>
                    <td className="py-3 px-2 text-kob-primary font-bold">₦{product.price || '—'}</td>
                    <td className="py-3 px-2 text-gray-600 text-xs truncate">{product.description}</td>
                    <td className="py-3 px-2 text-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={deleteLoading === product.id}
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id, product.title)}
                        variant="danger"
                        size="sm"
                        disabled={deleteLoading === product.id}
                      >
                        {deleteLoading === product.id ? '⏳' : '🗑️'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 mb-4">No products yet.</p>
            <Button
              onClick={() => window.location.href = '/marketplace'}
              variant="primary"
              size="lg"
            >
              Create Your First Product
            </Button>
          </div>
        )}
      </Card>

      {/* Resources */}
      <Card variant="outlined" className="p-6 bg-green-50">
        <h3 className="text-lg font-bold text-kob-dark mb-4">🚀 Seller Resources</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ <strong>Product Tips:</strong> Use clear titles and detailed descriptions</li>
          <li>✓ <strong>Pricing:</strong> Competitive pricing helps products sell faster</li>
          <li>✓ <strong>Images:</strong> High-quality images increase buyer confidence</li>
          <li>✓ <strong>Communication:</strong> Respond to buyer inquiries quickly</li>
          <li>✓ <a href="/help" className="text-kob-primary hover:underline font-bold">View Seller Guide →</a></li>
        </ul>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen message="Loading dashboard..." />

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-kob-light flex items-center justify-center p-4">
        <Card variant="elevated" className="text-center p-8 max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-kob-dark mb-2">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Button onClick={() => window.location.href = '/login'} variant="primary" size="lg" className="w-full">
            Go to Login
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-8">
        {/* Render appropriate dashboard based on user role */}
        {user.role === 'seller' ? (
          <SellerDashboard user={user} />
        ) : user.role === 'buyer' ? (
          <BuyerDashboard user={user} />
        ) : (
          // Admin view or default
          <SellerDashboard user={user} />
        )}
      </div>
    </main>
  )
}
