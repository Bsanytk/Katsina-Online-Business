import React, { useEffect, useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { getProducts, deleteProduct } from '../services/products'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoadingProducts(true)
    const items = await getProducts()
    setProducts(items)
    setLoadingProducts(false)
  }

  async function handleDelete(p) {
    if (!confirm('Delete?')) return
    await deleteProduct(p.id)
    fetchProducts()
  }

  if (loading) return <Loading />

  return (
    <div className="container py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56">
          <Sidebar />
        </div>
        <div className="flex-1 bg-white p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-600">Welcome, <strong>{user?.email}</strong> — role: {user?.role}</p>
          <section className="mt-4">
            <h3 className="font-semibold mb-3">Products</h3>
            {loadingProducts ? <Loading /> : (
              <ul className="space-y-3">
                {products.map(p => (
                  <li key={p.id} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <strong>{p.title}</strong>
                      <div className="text-sm text-gray-600">{p.description}</div>
                    </div>
                    <div>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(p)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
