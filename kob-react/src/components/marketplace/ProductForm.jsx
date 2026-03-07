import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
import Loading from '../Loading'
import { useTranslation } from '../../hooks/useTranslation'

/**
 * ProductForm Component
 * Form for creating or editing products with multi-image upload and draft support
 * 
 * Props:
 *   - onSubmit: Callback with form data (title, description, price, category, images, isDraft, etc)
 *   - onCancel: Callback when user cancels the form
 *   - initialData: Product data for edit mode (null for create mode)
 *   - loading: Boolean indicating submission loading state
 *   - error: String error message or null
 *   - uploadingImage: Boolean indicating image upload state
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
      // Only update if data actually changed
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => {
        const prevStr = JSON.stringify(prev)
        const newStr = JSON.stringify(newFormData)
        return prevStr !== newStr ? newFormData : prev
      })
      // Load existing images
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

  // Categories list
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Food & Beverages',
    'Health & Beauty',
    'Books',
    'Toys & Games',
    'Automotive',
    'Other',
  ]

  // Validate form
  function validateForm() {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = t('productForm.errors.titleRequired') || 'Product title is required'
    } else if (formData.title.length < 3) {
      errors.title = t('productForm.errors.titleMinLength') || 'Title must be at least 3 characters'
    } else if (formData.title.length > 100) {
      errors.title = t('productForm.errors.titleMaxLength') || 'Title must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      errors.description = t('productForm.errors.descriptionRequired') || 'Description is required'
    } else if (formData.description.length < 10) {
      errors.description = t('productForm.errors.descriptionMinLength') || 'Description must be at least 10 characters'
    } else if (formData.description.length > 1000) {
      errors.description = t('productForm.errors.descriptionMaxLength') || 'Description must be less than 1000 characters'
    }

    const price = Number(formData.price)
    if (!formData.price.trim()) {
      errors.price = t('productForm.errors.priceRequired') || 'Price is required'
    } else if (isNaN(price) || price <= 0) {
      errors.price = t('productForm.errors.priceInvalid') || 'Price must be a positive number'
    }

    if (!formData.category) {
      errors.category = t('productForm.errors.categoryRequired') || 'Category is required'
    }

    // WhatsApp number validation
    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = t('productForm.errors.whatsappRequired') || 'WhatsApp number is required'
    } else {
      // Remove non-digits and check length
      const cleaned = formData.whatsappNumber.replace(/\D/g, '')
      if (cleaned.length < 11) {
        errors.whatsappNumber = t('productForm.errors.whatsappInvalid') || 'Please enter a valid WhatsApp number (e.g., 2347089454544)'
      }
    }

    // At least one image required for publishing
    if (!formData.isDraft && images.length === 0) {
      errors.images = t('productForm.errors.imageRequired') || 'At least one image is required to publish'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle input change
  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  // Handle draft/publish toggle
  function handleToggleDraft() {
    setFormData((prev) => ({
      ...prev,
      isDraft: !prev.isDraft,
    }))
    if (validationErrors.images) {
      setValidationErrors((prev) => ({
        ...prev,
        images: null,
      }))
    }
  }

  // Handle image selection (multi-image)
  function handleImageChange(e) {
    const files = e.target.files
    if (!files) return

    const filesToAdd = Array.from(files).slice(0, MAX_IMAGES - images.length)

    filesToAdd.forEach((file, index) => {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setValidationErrors((prev) => ({
          ...prev,
          images: t('productForm.errors.imageTypeInvalid') || 'Only JPEG, PNG, and WebP images are allowed',
        }))
        return
      }

      // Validate file size (max 3MB per image)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          images: t('productForm.errors.imageSizeTooLarge') || 'Each image must be less than 2MB',
        }))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const newImage = {
          id: `new-${Date.now()}-${index}`,
          file,
          preview: event.target?.result,
          isNew: true,
        }
        setImages((prev) => [...prev, newImage])
        setValidationErrors((prev) => ({
          ...prev,
          images: null,
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove image from gallery
  function handleRemoveImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  // Reorder images (move image position)
  function handleMoveImage(id, direction) {
    const index = images.findIndex((img) => img.id === id)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      images, // Array of image objects
    })
  }

  const canAddMoreImages = images.length < MAX_IMAGES

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-6">
        {/* Header */}
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

        {/* Draft/Published Toggle */}
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
                {formData.isDraft
                  ? t('productForm.saveDraft') || '📝 Save as Draft'
                  : t('productForm.publish') || '✅ Publish Now'}
              </span>
            </label>
            <p className="text-xs text-blue-700 mt-1 ml-8">
              {formData.isDraft
                ? t('productForm.draftDescription') || 'Draft - Visible only to you'
                : t('productForm.publishDescription') || 'Published - Visible to all buyers'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert type="error" title={t('productForm.submissionError') || 'Submission Error'}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <Input
            label={t('productForm.productName') || 'Product Title'}
            name="title"
            type="text"
            placeholder={t('productForm.productNamePlaceholder') || 'e.g., iPhone 15 Pro Max'}
            value={formData.title}
            onChange={handleChange}
            error={validationErrors.title}
          />

          {/* Description Input */}
          <Textarea
            label={t('productForm.description') || 'Description'}
            name="description"
            placeholder={t('productForm.descriptionPlaceholder') || 'Describe your product in detail... (min 10 characters)'}
            value={formData.description}
            onChange={handleChange}
            rows={5}
            error={validationErrors.description}
          />

          {/* Price Input */}
          <Input
            label={t('productForm.price') || 'Price (₦)'}
            name="price"
            type="number"
            placeholder={t('productForm.pricePlaceholder') || 'e.g., 150000'}
            value={formData.price}
            onChange={handleChange}
            error={validationErrors.price}
            step="100"
            min="0"
          />

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-kob-dark mb-2">
              {t('productForm.category') || 'Category'}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 rounded-lg font-medium transition-colors focus:outline-none ${
                validationErrors.category
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-kob-primary'
              }`}
            >
              <option value="">{t('productForm.selectCategory') || 'Select a category...'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.category}</p>
            )}
          </div>

          {/* WhatsApp Number Input */}
          <Input
            label={t('productForm.whatsappNumber') || 'WhatsApp Number'}
            name="whatsappNumber"
            type="tel"
            placeholder={t('productForm.whatsappPlaceholder') || 'Enter WhatsApp number (234XXXXXXXXXX)'}
            value={formData.whatsappNumber}
            onChange={handleChange}
            error={validationErrors.whatsappNumber}
          />

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-kob-dark mb-2">
              {t('productForm.images') || 'Product Images'} ({images.length}/{MAX_IMAGES})
            </label>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                  >
                    <img
                      src={img.preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge for first image */}
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-kob-primary text-white text-xs px-2 py-1 rounded font-medium">
                        {t('productForm.mainImage') || 'Main'}
                      </div>
                    )}
                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(img.id, 'up')}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                          title={t('productForm.moveUp') || 'Move up'}
                        >
                          ↑
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(img.id, 'down')}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                          title={t('productForm.moveDown') || 'Move down'}
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        title={t('productForm.removeImage') || 'Remove'}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* File Input */}
            {canAddMoreImages && (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-kob-primary hover:bg-gray-50 transition-colors">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="font-medium text-gray-700">
                    {t('productForm.chooseImage') || 'Choose images or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('productForm.imageInfo') || 'PNG, JPG, WebP up to 5MB each (max 5 images)'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploadingImage || !canAddMoreImages}
                  className="hidden"
                />
              </label>
            )}

            {validationErrors.images && (
              <p className="text-sm text-red-500 mt-2">{validationErrors.images}</p>
            )}

            {uploadingImage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {t('productForm.uploading') || 'Uploading images...'}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || uploadingImage}
              className="flex-1"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  {t('productForm.saving') || 'Saving...'}
                </>
              ) : formData.isDraft ? (
                isEditMode
                  ? '💾 ' + (t('productForm.updateDraft') || 'Update Draft')
                  : '📝 ' + (t('productForm.createDraft') || 'Save Draft')
              ) : isEditMode ? (
                '✅ ' + (t('productForm.updatePublish') || 'Update & Publish')
              ) : (
                '✅ ' + (t('productForm.createPublish') || 'Create & Publish')
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={loading || uploadingImage}
            >
              {t('productForm.cancel') || 'Cancel'}
            </Button>
          </div>

          {/* Info Text */}
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            💡 <strong>{t('productForm.proTip') || 'Pro Tip'}</strong>
            {t('productForm.proTipText') || 'Use clear, descriptive titles and detailed descriptions to attract more buyers. Include dimensions, condition, and other relevant details. Add multiple images to showcase your product from different angles.'}
          </div>
        </form>
      </div>
    </Card>
  )
}
