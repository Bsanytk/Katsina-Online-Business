import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert, Select } from '../ui'
import Loading from '../Loading'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../firebase/auth'
import { getUserProfile } from '../../services/users'

export default function ProductForm({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = null,
  loading = false,
  error = null,
  uploadingImage = false,
}) {
  const t = useTranslation()
  const { user } = useAuth()

  const MAX_IMAGES = 5
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform?usp=header"

  const IMAGE_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect fill="%23f3f4f6" width="200" height="150"/%3E%3Ctext x="50%" y="50%" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsappNumber: '',
    location: '',
    sellerIDNumber: '',
    deliveryOption: 'KOB Express Delivery',
    isDraft: true,
  })

  const [images, setImages] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [isVerified, setIsVerified] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const categories = ['Electronics', 'Fashion', 'Beauty', 'Food', 'Services', 'Others']
  const deliveryOptions = ['KOB Express Delivery', 'Self Delivery']

  // ✅ LOAD PROFILE (SAFE MERGE)
  useEffect(() => {
    async function fetchSellerData() {
      if (!user?.uid) return
      try {
        const profile = await getUserProfile(user.uid)

        setIsVerified(profile?.isVerified === true)

        setFormData(prev => {
          const updated = { ...prev }

          if (!prev.sellerIDNumber && profile?.kobNumber) {
            updated.sellerIDNumber = profile.kobNumber
          }

          if (!prev.whatsappNumber && profile?.whatsappNumber) {
            updated.whatsappNumber = profile.whatsappNumber
          }

          return updated
        })

      } catch (err) {
        console.error('Error fetching seller profile:', err)
      }
      setCheckingStatus(false)
    }
    fetchSellerData()
  }, [user])

  // ✅ LOAD EDIT DATA (SAFE)
  useEffect(() => {
    if (!initialData) return

    setFormData(prev => ({
      ...prev,
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price?.toString() || '',
      category: initialData.category || '',
      whatsappNumber: initialData.whatsappNumber || prev.whatsappNumber,
      location: initialData.location || '',
      sellerIDNumber: initialData.sellerIDNumber || prev.sellerIDNumber,
      deliveryOption: initialData.deliveryOption || 'KOB Express Delivery',
      isDraft: initialData.isDraft ?? true,
    }))

    if (initialData.images) {
      setImages(initialData.images.map((img, idx) => ({
        id: `existing-${idx}`,
        preview: typeof img === 'string' ? img : img?.url || img?.secure_url,
        isExisting: true
      })))
    }
  }, [initialData])

  // ✅ CLEANUP
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.isNew && img.preview) {
          URL.revokeObjectURL(img.preview)
        }
      })
    }
  }, [images])

  // ✅ VALIDATION
  function validateForm() {
    const errors = {}

    if (!formData.title.trim()) errors.title = 'Required'
    if (!formData.description.trim()) errors.description = 'Required'
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Invalid price'
    if (!formData.category) errors.category = 'Required'
    if (!formData.whatsappNumber.trim()) errors.whatsappNumber = 'Required'
    if (!/^(\+?234|0)\d{10}$/.test(formData.whatsappNumber)) errors.whatsappNumber = 'Invalid format'
    if (!formData.location.trim()) errors.location = 'Required'
    if (images.length === 0) errors.images = 'Add at least 1 image'

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const remainingSlots = MAX_IMAGES - images.length
    if (remainingSlots <= 0) return

    const newImages = files.slice(0, remainingSlots).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      id: `img-${Date.now()}-${Math.random()}`
    }))

    setImages(prev => [...prev, ...newImages])
  }

  function handleRemoveImage(id) {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  async function handleSubmit(isDraft = false) {
    if (!user?.uid || !isVerified) {
      alert('Seller not verified or not logged in.')
      return
    }

    if (!validateForm()) return

    const submissionData = {
      ...formData,
      isDraft,
      ownerUid: user.uid,
      cleanWhatsapp: formData.whatsappNumber.replace(/\D/g, ''),
      price: Number(formData.price),
      images,
      deliveryLink:
        formData.deliveryOption === 'KOB Express Delivery'
          ? GOOGLE_FORM_URL
          : null
    }

    onSubmit(submissionData)
  }

  if (checkingStatus) return <Loading />

  return (
    <Card className="p-6 space-y-4">
      {error && <Alert type="error">{error}</Alert>}
      {!isVerified && (
  <Alert type="warning">
    <div className="space-y-3">
      <p className="font-semibold">
        Your account is not verified. You must verify before publishing products.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Google Form CTA */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-kob-primary text-white rounded-lg font-bold text-center"
        >
          📝 Fill Verification Form
        </a>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/2347089454544"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-center"
        >
          💬 Contact Admin
        </a>
      </div>
    </div>
  </Alert>
)}

      

      <form
        className="space-y-5"
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(false)
        }}
      >

        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" error={validationErrors.title} />

        <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description" error={validationErrors.description} />

        <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price in NGN" error={validationErrors.price} />

        <Select name="category" value={formData.category} onChange={handleChange} options={categories} placeholder="Select Category" error={validationErrors.category} />

        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" error={validationErrors.location} />

        <Input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="WhatsApp Number" error={validationErrors.whatsappNumber} />

        <Input name="sellerIDNumber" value={formData.sellerIDNumber} readOnly placeholder="Seller KOB ID" />

        <Select name="deliveryOption" value={formData.deliveryOption} onChange={handleChange} options={deliveryOptions} />

        {/* IMAGES */}
        <div>
          <label className="font-bold">Product Images (max 5)</label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded mt-2"
          />

          {validationErrors.images && (
            <p className="text-red-600 mt-1">{validationErrors.images}</p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map(img => (
                <div key={img.id} className="relative">
                  <img
                    src={img.preview || IMAGE_PLACEHOLDER}
                    onError={(e) => (e.target.src = IMAGE_PLACEHOLDER)}
                    className="h-24 w-full object-cover rounded"
                  />

                  {img.isExisting && (
                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                      Existing
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <Button type="button" onClick={() => handleSubmit(true)} disabled={loading || uploadingImage}>
            {loading || uploadingImage ? 'Saving...' : 'Save as Draft'}
          </Button>

          <Button type="submit" disabled={loading || uploadingImage || !isVerified}>
            {loading || uploadingImage ? 'Processing...' : 'Publish Product'}
          </Button>

          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
