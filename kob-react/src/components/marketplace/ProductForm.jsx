import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
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

  const MAX_IMAGES = 5
  const isEditMode = initialData !== null
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform?usp=header";

  // Load seller profile
  useEffect(() => {
    async function fetchSellerData() {
      if (!user?.uid) return
      try {
        const profile = await getUserProfile(user.uid)
        setIsVerified(profile?.isVerified === true)
        setFormData(prev => ({
          ...prev,
          sellerIDNumber: prev.sellerIDNumber || profile?.kobNumber || '',
          whatsappNumber: prev.whatsappNumber || profile?.whatsappNumber || '',
        }))
      } catch (err) {
        console.error('Error fetching seller profile:', err)
      }
      setCheckingStatus(false)
    }
    fetchSellerData()
  }, [user])

  // Load edit data
  useEffect(() => {
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      title: initialData.title || '',
      description: initialData.description || '',
      price: initialData.price?.toString() || '',
      category: initialData.category || '',
      whatsappNumber: initialData.whatsappNumber || prev.whatsappNumber || '',
      location: initialData.location || '',
      sellerIDNumber: initialData.sellerIDNumber || prev.sellerIDNumber || '',
      deliveryOption: initialData.deliveryOption || 'KOB Express Delivery',
      isDraft: initialData.isDraft ?? true,
    }))
    if (initialData.images) {
      setImages(initialData.images.map((img, idx) => ({
        id: `existing-${idx}`,
        preview: img,
        isExisting: true
      })))
    }
  }, [initialData])

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.isNew && img.preview) URL.revokeObjectURL(img.preview)
      })
    }
  }, [images])

  // Validate form
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
    if (files.length === 0) return

    const newImages = files.slice(0, MAX_IMAGES - images.length).map(file => ({
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isVerified) {
      alert('Seller account not verified. Cannot submit product.')
      return
    }
    if (!validateForm()) return

    const submissionData = {
      ...formData,
      ownerUid: user.uid,
      cleanWhatsapp: formData.whatsappNumber.replace(/\D/g, ''),
      price: Number(formData.price),
      images,
      deliveryLink: formData.deliveryOption === 'KOB Express Delivery' ? GOOGLE_FORM_URL : null
    }

    onSubmit(submissionData)
  }

  if (checkingStatus) return <Loading />

  return (
    <Card className="p-6 space-y-4">
      {error && <Alert type="error" title="Error">{error}</Alert>}
      {!isVerified && <Alert type="warning" title="Unverified Seller">Verify your account to publish products</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">

        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          error={validationErrors.title}
        />

        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Product Description"
          error={validationErrors.description}
        />

        <Input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price in NGN"
          error={validationErrors.price}
        />

        <Input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          error={validationErrors.category}
        />

        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          error={validationErrors.location}
        />

        <Input
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          error={validationErrors.whatsappNumber}
        />

        <Input
          name="sellerIDNumber"
          value={formData.sellerIDNumber}
          readOnly
          placeholder="Seller KOB ID"
        />

        {/* Images */}
        <div>
          <label className="font-bold">Product Images (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded mt-2"
          />
          {validationErrors.images && <p className="text-red-600 mt-1">{validationErrors.images}</p>}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map(img => (
                <div key={img.id} className="relative">
                  <img src={img.preview} className="h-24 w-full object-cover rounded" />
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

        {/* Draft / Publish */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => {
              setFormData(prev => ({ ...prev, isDraft: true }))
              handleSubmit({ preventDefault: () => {} })
            }}
            variant="secondary"
            disabled={loading || uploadingImage}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={loading || uploadingImage || !isVerified}>
            {loading ? 'Processing...' : 'Publish Product'}
          </Button>
        </div>

      </form>
    </Card>
  )
}
