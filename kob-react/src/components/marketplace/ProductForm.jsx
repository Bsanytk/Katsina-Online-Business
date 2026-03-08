import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
import Loading from '../Loading'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../firebase/auth' // Added for production security

/**
 * ProductForm Component
 * Form for creating or editing products with multi-image upload and draft support
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
  const { user } = useAuth() // Access the logged-in seller's identity
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsappNumber: '',
    isDraft: true, // Save as draft by default
  })
  const [images, setImages] = useState([]) // Array of image objects: { file, preview, id }
  const [validationErrors, setValidationErrors] = useState({})

  const MAX_IMAGES = 5
  const isEditMode = initialData !== null

  // Populate form with initial data (edit mode)
  useEffect(() => {
    if (initialData) {
      const newFormData = {
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || '',
        whatsappNumber: initialData.whatsappNumber || '',
        isDraft: initialData.isDraft ?? true,
      }
      
      setFormData((prev) => {
        const prevStr = JSON.stringify(prev)
        const newStr = JSON.stringify(newFormData)
        return prevStr !== newStr ? newFormData : prev
      })

      if (initialData.images && Array.isArray(initialData.images)) {
        setImages(
          initialData.images.map((img, idx) => ({
            id: `existing-${idx}`,
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
    } else if (formData.title.length < 3) {
      errors.title = t('productForm.errors.titleMinLength') || 'Title must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      errors.description = t('productForm.errors.descriptionRequired') || 'Description is required'
    }

    const price = Number(formData.price)
    if (!formData.price.toString().trim()) {
      errors.price = t('productForm.errors.priceRequired') || 'Price is required'
    } else if (isNaN(price) || price <= 0) {
      errors.price = t('productForm.errors.priceInvalid') || 'Price must be a positive number'
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
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  function handleToggleDraft() {
    setFormData((prev) => ({ ...prev, isDraft: !prev.isDraft }))
    if (validationErrors.images) {
      setValidationErrors((prev) => ({ ...prev, images: null }))
    }
  }

  function handleImageChange(e) {
    const files = e.target.files
    if (!files) return

    const filesToAdd = Array.from(files).slice(0, MAX_IMAGES - images.length)

    filesToAdd.forEach((file, index) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return
      if (file.size > 5 * 1024 * 1024) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage = {
          id: `new-${Date.now()}-${index}`,
          file,
          preview: event.target?.result,
          isNew: true,
        }
        setImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  function handleRemoveImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function handleMoveImage(id, direction) {
    const index = images.findIndex((img) => img.id === id)
    if (index === -1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    const newImages = [...images]
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  /**
   * Submission handler updated for Production Security
   */
  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) return

    // CRITICAL SECURITY CHECK
    if (!user?.uid) {
      alert("Session expired. Please log in again.")
      return
    }

    onSubmit({
      ...formData,
      ownerUid: user.uid, // Explicitly linking this product to the current seller
      price: Number(formData.price),
      images, 
    })
  }

  const canAddMoreImages = images.length < MAX_IMAGES

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-kob-dark mb-2">
            {isEditMode ? '✏️ ' + (t('productForm.editProduct') || 'Edit Product') : '➕ ' + (t('productForm.addProduct') || 'Add New Product')}
          </h2>
          <p className="text-gray-600">
            {isEditMode
              ? t('productForm.editDescription') || 'Update your product information'
              : t('productForm.addDescription') || 'Fill in the details below to list your product'}
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-1">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDraft}
                onChange={handleToggleDraft}
                className="w-5 h-5 rounded accent-kob-primary"
              />
              <span className="font-medium text-blue-900">
                {formData.isDraft ? '📝 Save as Draft' : '✅ Publish Now'}
              </span>
            </label>
          </div>
        </div>

        {error && <Alert type="error" title="Submission Error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            error={validationErrors.title}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            error={validationErrors.description}
          />

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
              <option value="">Select a category...</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <Input
            label="WhatsApp Number"
            name="whatsappNumber"
            type="tel"
            value={formData.whatsappNumber}
            onChange={handleChange}
            error={validationErrors.whatsappNumber}
          />

          {/* Image Section */}
          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">Images ({images.length}/{MAX_IMAGES})</label>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {images.map((img, index) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs"
                  >✕</button>
                </div>
              ))}
            </div>

            {canAddMoreImages && (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50">
                <p>📷 Click to add images</p>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" size="lg" disabled={loading || uploadingImage} className="flex-1">
              {loading ? 'Saving...' : formData.isDraft ? 'Save Draft' : 'Publish Product'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </div>
    </Card>
  )
      }
            
