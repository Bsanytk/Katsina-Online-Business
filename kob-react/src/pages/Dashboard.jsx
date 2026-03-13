import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'
import BackButton from '../components/BackButton'
import OrdersTab from '../components/dashboard/OrdersTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import SellerProfileEdit from '../components/dashboard/SellerProfileEdit'

/* ------------------------------
   Helper Utilities
--------------------------------*/

const getUsername = (email = '') => email.split('@')[0] || 'User'

/* ------------------------------
   Reusable Tab Navigation
--------------------------------*/

function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 border-b-2 border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
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
  )
}

/* ------------------------------
   Buyer Dashboard
--------------------------------*/

function BuyerDashboard({ user }) {

  const navigate = useNavigate()

  const [savedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'messages', label: '💬 Messages' }
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        // future Firestore saved products fetch
      } catch (err) {
        if (import.meta.env.DEV) console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-8">

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'overview' && (
        <div className="space-y-8">

          {/* Welcome */}
          <Card variant="elevated" className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white p-8 rounded-2xl">
            <h1 className="text-3xl font-bold">
              Welcome, {getUsername(user.email)} 👋
            </h1>
            <p className="opacity-90 mt-2">
              Browse and buy products from trusted sellers across Katsina.
            </p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Card variant="elevated" className="p-6 text-center">
              ❤️
              <p className="text-sm text-gray-500">Saved Products</p>
              <p className="text-3xl font-bold text-kob-primary">
                {savedProducts.length}
              </p>
            </Card>

            <Card variant="elevated" className="p-6 text-center">
              📦
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-3xl font-bold text-kob-primary">0</p>
            </Card>

            <Card variant="elevated" className="p-6 text-center">
              ⭐
              <p className="text-sm text-gray-500">Reviews</p>
              <p className="text-3xl font-bold text-kob-primary">0</p>
            </Card>

          </div>

          {/* Saved Products */}
          <Card variant="elevated" className="p-8">

            <h2 className="text-2xl font-bold mb-6">
              ❤️ Saved Products
            </h2>

            {loading ? (
              <Loading message="Loading saved products..." />
            ) : savedProducts.length === 0 ? (
              <div className="text-center py-10">

                <p className="text-gray-600 mb-6">
                  No saved products yet.
                </p>

                <Button
                  onClick={() => navigate('/marketplace')}
                  variant="primary"
                >
                  Browse Marketplace
                </Button>

              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* products will render here */}
              </div>
            )}

          </Card>

        </div>
      )}

      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'messages' && <MessagesTab />}
    </div>
  )
}

/* ------------------------------
   Seller Dashboard
--------------------------------*/

function SellerDashboard({ user }) {

  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  const tabs = [
    { id: 'products', label: '📦 Products' },
    { id: 'sales', label: '💰 Sales' },
    { id: 'messages', label: '💬 Messages' },
    { id: 'profile', label: '👤 Profile' }
  ]

  const fetchProducts = useCallback(async () => {

    setLoadingProducts(true)

    try {

      const items = await getProducts({ pageSize: 20 })

      setProducts(items)

    } catch (err) {

      if (import.meta.env.DEV) console.error(err)

    } finally {

      setLoadingProducts(false)

    }

  }, [])

  useEffect(() => {

    fetchProducts()

  }, [fetchProducts])


  const handleDelete = async (productId, title) => {

    if (!window.confirm(`Delete "${title}"?`)) return

    setDeleteLoading(productId)

    try {

      await deleteProduct(productId)

      setShowDeleteSuccess(true)

      await fetchProducts()

      setTimeout(() => setShowDeleteSuccess(false), 4000)

    } catch (err) {

      alert('Failed to delete product.')

    } finally {

      setDeleteLoading(null)

    }

  }

  return (

    <div className="space-y-8">

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'products' && (

        <div className="space-y-8">

          <Card variant="elevated" className="p-8 bg-kob-primary text-white rounded-xl">

            <h1 className="text-3xl font-bold">

              Welcome, {getUsername(user.email)} 👋

            </h1>

            <p className="opacity-90">

              Manage your marketplace products easily.

            </p>

          </Card>


          {showDeleteSuccess && (
            <Alert
              type="success"
              title="Product Deleted"
              onDismiss={() => setShowDeleteSuccess(false)}
            >
              Your product was deleted successfully.
            </Alert>
          )}


          <Card variant="elevated" className="p-8">

            <div className="flex justify-between mb-6">

              <h2 className="text-2xl font-bold">

                My Products

              </h2>

              <Button
                onClick={() => navigate('/marketplace')}
                variant="primary"
              >
                + Add Product
              </Button>

            </div>


            {loadingProducts ? (

              <Loading message="Loading products..." />

            ) : products.length === 0 ? (

              <div className="text-center py-10">

                <p className="text-gray-600 mb-6">

                  No products yet.

                </p>

                <Button
                  onClick={() => navigate('/marketplace')}
                  variant="primary"
                >
                  Create First Product
                </Button>

              </div>

            ) : (

              <table className="w-full text-sm">

                <thead>

                  <tr>

                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((p) => (

                    <tr key={p.id}>

                      <td>{p.title}</td>

                      <td>₦{p.price}</td>

                      <td className="space-x-2">

                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/marketplace?edit=${p.id}`)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deleteLoading === p.id}
                        >
                          {deleteLoading === p.id ? '⏳' : 'Delete'}
                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </Card>

        </div>

      )}

      {activeTab === 'sales' && <OrdersTab />}
      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'profile' && <SellerProfileEdit />}

    </div>

  )

}

/* ------------------------------
   Root Dashboard
--------------------------------*/

export default function Dashboard() {

  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen message="Loading dashboard..." />

  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Card className="p-8 text-center">

          <h1 className="text-xl font-bold mb-4">

            Sign In Required

          </h1>

          <Button
            onClick={() => window.location.href = '/login'}
            variant="primary"
          >
            Login
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

        {user.role === 'seller'
          ? <SellerDashboard user={user} />
          : <BuyerDashboard user={user} />
        }

      </div>

    </main>

  )

}
