import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
import Loading from '../Loading'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../firebase/auth' // Added for seller identity

/**
 * ProductForm Component
 * Fully updated for KOB Marketplace production
 */
export default function ProductForm({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = null,
  loading = false,
  error = null,
  uploadingImage = false,
}) {
  const t = useTranslation()
  const { user } = useAuth() // Access current logged-in user
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsappNumber: '',
    isDraft: true,
  })
  
  const [images, setImages] = useState([])
  const [validationErrors, setValidationErrors] = useState({})

  const MAX_IMAGES = 5
  const isEditMode = initialData !== null

  // Sync form with initialData (for Edit Mode)
  useEffect(() => {
    if (initialData) {
      const newFormData = {
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        whatsappNumber: initialData.whatsappNumber || '',
        isDraft: initialData.isDraft ?? true,
      }
      
      setFormData(newFormData)

      if (initialData.images && Array.isArray(initialData.images)) {
        setImages(
          initialData.images.map((img, idx) => ({
            id: img.id || `existing-${idx}`,
            preview: img.url || img,
            isExisting: true,
          }))
        )
      }
    }
  }, [initialData])

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports',
    'Food & Beverages', 'Health & Beauty', 'Books',
    'Toys & Games', 'Automotive', 'Other',
  ]

  function validateForm() {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = t('productForm.errors.titleRequired') || 'Product title is required'
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      errors.description = t('productForm.errors.descriptionMinLength') || 'Description must be at least 10 characters'
    }

    const price = Number(formData.price)
    if (!formData.price || isNaN(price) || price <= 0) {
      errors.price = t('productForm.errors.priceInvalid') || 'Enter a valid price'
    }

    if (!formData.category) {
      errors.category = t('productForm.errors.categoryRequired') || 'Category is required'
    }

    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = t('productForm.errors.whatsappRequired') || 'WhatsApp number is required'
    }

    if (!formData.isDraft && images.length === 0) {
      errors.images = t('productForm.errors.imageRequired') || 'At least one image is required to publish'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  function handleToggleDraft() {
    setFormData(prev => ({ ...prev, isDraft: !prev.isDraft }))
  }

  function handleImageChange(e) {
    const files = e.target.files
    if (!files) return

    const filesToAdd = Array.from(files).slice(0, MAX_IMAGES - images.length)

    filesToAdd.forEach((file, index) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return
      if (file.size > 5 * 1024 * 1024) return // 5MB limit

      const reader = new FileReader()
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: `new-${Date.now()}-${index}`,
          file,
          preview: event.target?.result,
          isNew: true,
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  function handleRemoveImage(id) {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) return

    // Critical Production Security Check
    if (!user?.uid) {
      alert("Error: You must be logged in to post products.")
      return
    }

    onSubmit({
      ...formData,
      ownerUid: user.uid, // Automatically link product to seller
      price: Number(formData.price),
      images, 
    })
  }

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-kob-dark mb-2">
            {isEditMode ? '✏️ ' + (t('productForm.editProduct') || 'Edit Product') : '➕ ' + (t('productForm.addProduct') || 'Add New Product')}
          </h2>
        </div>

        {/* Status Toggle */}
        <div className={`p-4 rounded-lg border ${formData.isDraft ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDraft}
              onChange={handleToggleDraft}
              className="w-5 h-5 rounded accent-kob-primary"
            />
            <span className={`font-bold ${formData.isDraft ? 'text-amber-900' : 'text-green-900'}`}>
              {formData.isDraft ? '📝 Save as Draft' : '🚀 Publish to Marketplace'}
            </span>
          </label>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Title"
            name="title"
            placeholder="e.g. Toyota Corolla 2022"
            value={formData.title}
            onChange={handleChange}
            error={validationErrors.title}
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Describe your product..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            error={validationErrors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price (₦)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={validationErrors.price}
            />

            <div>
              <label className="block text-sm font-semibold text-kob-dark mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-2 rounded-lg ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {validationErrors.category && <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>}
            </div>
          </div>

          <Input
            label="WhatsApp Contact"
            name="whatsappNumber"
            placeholder="23480..."
            value={formData.whatsappNumber}
            onChange={handleChange}
            error={validationErrors.whatsappNumber}
          />

          {/* Image Section */}
          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">Images ({images.length}/{MAX_IMAGES})</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50">
                  <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full"
                  >✕</button>
                </div>
              ))}
              {images.length < MAX_IMAGES && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <span className="text-2xl">📷</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
            {validationErrors.images && <p className="text-xs text-red-500">{validationErrors.images}</p>}
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={loading || uploadingImage}>
              {loading ? 'Processing...' : (formData.isDraft ? 'Save Draft' : 'Submit Listing')}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
