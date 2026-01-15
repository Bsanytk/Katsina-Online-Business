import React, { useEffect, useState } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/products'
import Loading from '../components/Loading'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../firebase/auth'
import { uploadImage } from '../services/cloudinary'
import ProductList from '../components/marketplace/ProductList'
import ProductFilter from '../components/marketplace/ProductFilter'
import ProductForm from '../components/marketplace/ProductForm'
import { Card, Alert } from '../components/ui'

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formError, setFormError] = useState(null)

  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const items = await getProducts()
      setProducts(items)
      setFilteredProducts(items)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission (create or edit)
  async function handleProductSubmit(formData) {
    setSubmitting(true)
    setFormError(null)

    try {
      let uploadedURL = null

      // Upload image if provided
      if (formData.imageFile) {
        setUploadingImage(true)
        try {
          uploadedURL = await uploadImage(formData.imageFile)
        } catch (err) {
          setFormError('Image upload failed: ' + err.message)
          setUploadingImage(false)
          setSubmitting(false)
          return
        }
        setUploadingImage(false)
      }

      // Prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        ownerUid: user.uid,
      }

      if (uploadedURL) {
        payload.imageURL = uploadedURL
      } else if (editingProduct && editingProduct.imageURL) {
        // Keep existing image if not updating
        payload.imageURL = editingProduct.imageURL
      }

      // Create or update
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await addProduct(payload)
      }

      // Reset form and refresh products
      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(product) {
    setEditingProduct(product)
    setShowForm(true)
    setFormError(null)
  }

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.title}"?`)) return

    try {
      await deleteProduct(product.id)
      fetchProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleCancelForm() {
    setShowForm(false)
    setEditingProduct(null)
    setFormError(null)
  }

  const canCreate = user && (user.role === 'seller' || user.role === 'admin')

  return (
    <main className="min-h-screen bg-kob-light">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 mb-8">
        <div className="container">
          <h1 className="text-4xl font-bold text-kob-dark mb-2">Marketplace</h1>
          <p className="text-gray-600">Browse and discover amazing products from sellers in Katsina</p>
        </div>
      </div>

      <div className="container pb-12">
        {/* Global Error Alert */}
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Add Product Section - Sellers Only */}
        {canCreate && (
          <div className="mb-12">
            {!showForm ? (
              <Card variant="elevated" className="p-6 text-center">
                <div className="mb-4">
                  <span className="text-4xl">📦</span>
                </div>
                <h3 className="text-xl font-bold text-kob-dark mb-2">Ready to Sell?</h3>
                <p className="text-gray-600 mb-6">Create a product listing and start selling to thousands of buyers</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-kob-primary hover:bg-opacity-90 text-white rounded-lg font-medium transition-all"
                >
                  ➕ Add New Product
                </button>
              </Card>
            ) : (
              <ProductForm
                onSubmit={handleProductSubmit}
                onCancel={handleCancelForm}
                initialData={editingProduct}
                loading={submitting}
                error={formError}
                uploadingImage={uploadingImage}
              />
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilter
              products={products}
              onFilter={setFilteredProducts}
            />
          </div>

          {/* Products List */}
          <div className="lg:col-span-3">
            <ProductList
              products={filteredProducts}
              loading={loading}
              error={error}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              itemsPerPage={12}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
