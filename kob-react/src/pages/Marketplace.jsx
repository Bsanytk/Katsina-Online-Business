import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/products'
import Loading from '../components/Loading'
import ProductList from '../components/marketplace/ProductList'
import ProductFilter from '../components/marketplace/ProductFilter'
import ProductForm from '../components/marketplace/ProductForm'
import { Card, Alert } from '../components/ui'
import BackButton from '../components/BackButton'
import { useAuth } from '../firebase/auth'
import { uploadImage } from '../services/cloudinary'
import { getUserProfile, updateUserProfile } from '../services/users'

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
  const [searchParams, setSearchParams] = useSearchParams()

  // --- Load all products
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const items = await getProducts({ pageSize: 50 })
      setProducts(items)
      setFilteredProducts(items)
      setError(null)
    } catch (err) {
      setError("Failed to load products. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  // --- Load Product for Editing via URL param
  const loadProductForEdit = useCallback((productId) => {
    const product = products.find(p => p.id === productId)
    if (product && product.ownerUid === user?.uid) {
      setEditingProduct(product)
      setShowForm(true)
      setSearchParams({})
    }
  }, [products, user?.uid, setSearchParams])

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId && user?.uid && products.length > 0) {
      loadProductForEdit(editId)
    }
  }, [searchParams, user?.uid, products, loadProductForEdit])

  // --- Product Submission (Add / Update) ---
  async function handleProductSubmit(formData) {
    if (!user) return setFormError("You must be logged in to perform this action.")
    setSubmitting(true)
    setFormError(null)

    try {
      // --- Ensure KOB Number exists
      const profile = await getUserProfile(user.uid)
      let sellerID = profile?.kobNumber
      if (!sellerID) {
        sellerID = `KOB-${Math.floor(100000 + Math.random() * 900000)}`
        await updateUserProfile(user.uid, { kobNumber: sellerID })
      }

      // --- Upload images if new
      setUploadingImage(true)
      const finalImages = []
      for (const img of formData.images) {
        if (img.isNew) {
          const uploadedUrl = await uploadImage(img.file)
          finalImages.push({ url: uploadedUrl, id: `img-${Date.now()}-${Math.random()}` })
        } else if (img.isExisting) {
          finalImages.push({ url: img.preview, id: img.id })
        }
      }
      setUploadingImage(false)

      const firstImageUrl = finalImages[0]?.url || ''
      const payload = {
        ...formData,
        ownerUid: user.uid,
        sellerIDNumber: sellerID,
        imageUrl: firstImageUrl,
        mainImage: firstImageUrl,
        images: finalImages.map(i => i.url),
        updatedAt: new Date(),
        deliveryLink: formData.deliveryOption === 'KOB Express Delivery' ? formData.deliveryLink : null
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await addProduct(payload)
      }

      setShowForm(false)
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  // --- Edit & Delete ---
  function handleEdit(product) {
    setEditingProduct(product)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(product) {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) return
    try {
      await deleteProduct(product.id)
      fetchProducts()
    } catch (err) {
      alert("Delete failed: " + err.message)
    }
  }

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4"><BackButton /></div>

      <header className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-12 shadow-inner">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">KOB Marketplace</h1>
          <p className="text-lg opacity-90 max-w-xl">The heart of business in Katsina. Sell faster, reach further.</p>
        </div>
      </header>

      <div className="container pb-20 pt-10">
        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        {user && (
          <section className="mb-12">
            {!showForm ? (
              <Card variant="outlined" hover className="p-8 text-center border-dashed border-2 border-kob-primary/40 bg-white/50 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-kob-dark mb-2">Have something to sell?</h3>
                <p className="text-gray-500 mb-6">List your items today and reach buyers across the state.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-10 py-3 bg-kob-primary text-white rounded-full font-bold shadow-kob-primary/20 shadow-lg hover:scale-105 transition-transform"
                >
                  ➕ Create New Listing
                </button>
              </Card>
            ) : (
              <ProductForm
                onSubmit={handleProductSubmit}
                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                initialData={editingProduct}
                loading={submitting}
                error={formError}
                uploadingImage={uploadingImage}
              />
            )}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilter products={products} onFilter={setFilteredProducts} />
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loading size="lg" />
                <p className="mt-4 text-gray-400 animate-pulse">Fetching latest listings...</p>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                itemsPerPage={12}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
