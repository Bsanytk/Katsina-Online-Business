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
import BackButton from '../components/BackButton'

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
      // fetch a limited set to avoid reading full collection
      const items = await getProducts({ pageSize: 50 })
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
      // Collect uploaded image URLs (handle multi-image formData.images)
      let uploadedURLs = []

      if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
        setUploadingImage(true)
        try {
          // Upload new images and preserve existing image URLs
          for (const img of formData.images) {
            if (img && img.file) {
              const url = await uploadImage(img.file)
              uploadedURLs.push(url)
            } else if (img && img.preview && img.isExisting) {
              // preview for existing images contains the URL
              uploadedURLs.push(img.preview)
            }
          }
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
        sellerId: user.uid,  // Consistency with reviews/orders schema
      }

      // If we have uploaded or existing URLs, set main image and images array
      if (uploadedURLs.length > 0) {
        payload.imageURL = uploadedURLs[0]
        payload.images = uploadedURLs
      } else if (editingProduct) {
        // Preserve existing image(s) when editing and no new uploads
        if (editingProduct.imageURL) payload.imageURL = editingProduct.imageURL
        if (editingProduct.images) payload.images = editingProduct.images
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

  const canCreate = user != null  // Any authenticated user can create products (no role checks)

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3">Marketplace</h1>
            <p className="text-xl md:text-2xl opacity-95 font-light">Browse and discover amazing products from verified sellers in Katsina</p>
          </div>
        </div>
      </div>

      <div className="container pb-16 pt-12">
        {/* Global Error Alert */}
        {error && (
          <Alert type="error" className="mb-8 animate-fade-in">
            {error}
          </Alert>
        )}

        {/* Add Product Section - Sellers Only */}
        {canCreate && (
          <div className="mb-16">
            {!showForm ? (
              <Card variant="elevated" className="p-8 md:p-10 text-center rounded-2xl border-2 border-dashed border-kob-primary bg-gradient-to-br from-white to-kob-light">
                <div className="mb-4 inline-block">
                  <span className="text-6xl block">📦</span>
                </div>
                <h3 className="text-2xl font-bold text-kob-dark mb-3">Ready to Sell Your Products?</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">Create a product listing and start selling to thousands of active buyers across Katsina</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-kob-primary to-kob-primary-dark hover:shadow-lg text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  ➕ Add New Product
                </button>
              </Card>
            ) : (
              <div className="animate-fade-in">
                <ProductForm
                  onSubmit={handleProductSubmit}
                  onCancel={handleCancelForm}
                  initialData={editingProduct}
                  loading={submitting}
                  error={formError}
                  uploadingImage={uploadingImage}
                />
              </div>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ProductFilter
                products={products}
                onFilter={setFilteredProducts}
              />
            </div>
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
