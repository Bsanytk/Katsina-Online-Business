import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'
import BackButton from '../components/BackButton'
import OrdersTab from '../components/dashboard/OrdersTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import SellerProfileEdit from '../components/dashboard/SellerProfileEdit'

// Buyer Dashboard View
function BuyerDashboard({ user }) {
  const [savedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // TODO: Fetch user's saved products from Firestore
    const loadData = async () => {
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b-2 border-gray-200 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'orders', label: '📦 Orders', icon: '📦' },
          { id: 'messages', label: '💬 Messages', icon: '💬' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-kob-primary border-b-4 border-kob-primary'
                : 'text-gray-600 hover:text-kob-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card variant="elevated" className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white p-8 md:p-10 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="text-6xl">👋</div>
              <div>
                <h1 className="text-4xl font-extrabold mb-3">Welcome, {user.email.split('@')[0]}!</h1>
                <p className="text-lg opacity-95 font-light">
                  Browse, save, and purchase products from verified sellers across Katsina with confidence.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">❤️</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">Saved Products</p>
              <p className="text-4xl font-bold text-kob-primary">{savedProducts.length}</p>
            </Card>
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">📦</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">Active Orders</p>
              <p className="text-4xl font-bold text-kob-primary">0</p>
            </Card>
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">⭐</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">My Reviews</p>
              <p className="text-4xl font-bold text-kob-primary">0</p>
            </Card>
          </div>

          {/* Saved Products Section */}
          <Card variant="elevated" className="p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-kob-dark mb-8 flex items-center gap-3">
              <span className="text-5xl">❤️</span> Saved Products
            </h2>

            {loading ? (
              <Loading message="Loading saved products..." />
            ) : savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Products will be displayed here */}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">📭</div>
                <p className="text-gray-600 text-lg mb-8 font-medium">No saved products yet.</p>
                <Button
                  onClick={() => window.location.href = '/marketplace'}
                  variant="primary"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Browsing Marketplace
                </Button>
              </div>
            )}
          </Card>

          {/* Resources */}
          <Card variant="outlined" className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <span className="text-4xl">💡</span> Quick Tips for Smart Shopping
            </h3>
            <ul className="space-y-3 text-base text-blue-900">
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Save products to your favorites for easy access later</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Check seller ratings before making a purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Use WhatsApp to contact sellers directly for inquiries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Read buyer reviews to make informed purchasing decisions</span>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'messages' && <MessagesTab />}
    </div>
  )
}

// Seller Dashboard View
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
  setLoadingProducts(true)
  try {
    // Pass sellerId to only get their own products
    const items = await getProducts({ pageSize: 10, sellerId: user.uid })
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
      if (import.meta.env.DEV) console.error('Error deleting product:', err)
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b-2 border-gray-100 overflow-x-auto">
        {[
          { id: 'products', label: '📦 Products', icon: '📦' },
          { id: 'sales', label: '💰 Sales', icon: '💰' },
          { id: 'messages', label: '💬 Messages', icon: '💬' },
          { id: 'profile', label: '👤 Profile', icon: '👤' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-kob-primary border-b-2 border-kob-primary'
                : 'text-gray-400 hover:text-kob-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          {/* Welcome Card */}
          <Card variant="elevated" className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white p-8 md:p-10 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="text-6xl">👋</div>
              <div>
                <h1 className="text-3xl font-extrabold mb-3">Welcome, {user.email.split('@')[0]}!</h1>
                <p className="text-lg opacity-90 font-light">
                  ✓ You can manage your products and reach thousands of customers across Katsina.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">📦</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">Active Products</p>
              <p className="text-4xl font-bold text-kob-primary">{products.length}</p>
            </Card>
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">👥</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">Total Views</p>
              <p className="text-4xl font-bold text-kob-primary">0</p>
            </Card>
            <Card variant="elevated" className="p-7 rounded-xl text-center card-hover">
              <div className="text-5xl mb-3 inline-block">⭐</div>
              <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-2">Average Rating</p>
              <p className="text-4xl font-bold text-kob-primary">—</p>
            </Card>
          </div>

          {/* Delete Success Alert */}
          {showDeleteSuccess && (
            <Alert type="success" title="Product Deleted" onDismiss={() => setShowDeleteSuccess(false)}>
              Your product has been successfully deleted.
            </Alert>
          )}

          {/* Products Management Section */}
          <Card variant="elevated" className="p-8 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-kob-dark flex items-center gap-3">
                <span className="text-5xl">📦</span> My Products
              </h2>
              <Button
                onClick={() => window.location.href = '/marketplace'}
                variant="primary"
                size="lg"
                className="shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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
                            onClick={() => window.location.href = `/marketplace?edit=${product.id}`}
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
                            {deleteLoading === product.id ? '⌛': 'Delete'}
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
      )}

      {activeTab === 'sales' && <OrdersTab />}
      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'profile' && <SellerProfileEdit />}
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
      <div className="container py-4">
        <BackButton />
      </div>
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
          
