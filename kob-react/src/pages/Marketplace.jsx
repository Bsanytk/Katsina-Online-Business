import React, { useEffect, useState } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/products'
import Loading from '../components/Loading'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../firebase/auth'
import { uploadImage } from '../services/cloudinary'

export default function Marketplace() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', price: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const items = await getProducts()
      setProducts(items)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    setImageFile(f || null)
    setImagePreview(f ? URL.createObjectURL(f) : null)
  }

  // Create product: if an image is selected we upload to Cloudinary first
  // and store the returned imageURL in Firestore (field `imageURL`).
  async function handleAdd(e) {
    e.preventDefault()
    if (!user) return alert('Login required to create product')

    try {
      setError(null)
      let uploadedURL = null
      if (imageFile) {
        setUploadingImage(true)
        try {
          // uploadImage uses VITE_CLOUDINARY_* env vars and returns secure_url
          uploadedURL = await uploadImage(imageFile)
        } catch (err) {
          setError('Image upload failed: ' + err.message)
          setUploadingImage(false)
          return
        }
        setUploadingImage(false)
      }

      // ownerUid links the product to the creating user
      const payload = { ...form, price: Number(form.price) || 0, ownerUid: user.uid }
      if (uploadedURL) payload.imageURL = uploadedURL

      await addProduct(payload)
      setForm({ title: '', description: '', price: '' })
      setImageFile(null)
      setImagePreview(null)
      fetchProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleEdit(product) {
    const title = prompt('Title', product.title)
    const description = prompt('Description', product.description)
    if (title == null || description == null) return
    await updateProduct(product.id, { title, description })
    fetchProducts()
  }

  async function handleDelete(product) {
    if (!confirm('Delete this product?')) return
    await deleteProduct(product.id)
    fetchProducts()
  }

  const canCreate = user && (user.role === 'admin' || user.role === 'verified')

  return (
    <main className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-kob-dark">Marketplace</h1>
      </div>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {canCreate && (
        <form onSubmit={handleAdd} className="mt-6 mb-8 bg-white p-4 rounded shadow-sm">
          <h4 className="font-semibold mb-3">Add product</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="p-2 border rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="p-2 border rounded" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <textarea className="p-2 border rounded col-span-1 sm:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

            <label className="block col-span-1 sm:col-span-2">
              <div className="text-sm mb-1">Image (optional)</div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-48 h-36 object-cover rounded" />}
            </label>

            <div className="col-span-1 sm:col-span-2">
              <button type="submit" disabled={uploadingImage || loading} className="px-4 py-2 bg-kob-primary text-white rounded">
                {uploadingImage ? 'Uploading image...' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} user={user} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </main>
  )
}
