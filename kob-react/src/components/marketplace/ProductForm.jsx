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
    sellerIDNumber: '',  // Auto-fill KOB ID
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

  // ✅ Load seller profile to auto-fill KOB ID
  useEffect(() => {
    async function fetchSellerData() {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid)
          setIsVerified(profile?.isVerified === true)

          // Auto-fill sellerIDNumber only if blank (prevent override)
          setFormData(prev => ({
            ...prev,
            sellerIDNumber: prev.sellerIDNumber || profile?.kobNumber || '',
            whatsappNumber: prev.whatsappNumber || profile?.whatsappNumber || '',
          }))
        } catch (err) {
          console.error('Error fetching seller profile:', err)
        }
      }
      setCheckingStatus(false)
    }
    fetchSellerData()
  }, [user])

  // Load edit data
  useEffect(() => {
    if (initialData) {
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
        setImages(
          initialData.images.map((img, idx) => ({
            id: `existing-${idx}`,
            preview: img,
            isExisting: true,
          }))
        )
      }
    }
  }, [initialData])

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.isNew && img.preview) {
          URL.revokeObjectURL(img.preview)
        }
      })
    }
  }, [images])

  function validateForm() {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Required'
    if (!formData.description.trim()) errors.description = 'Required'
    if (!formData.price) errors.price = 'Required'
    if (!formData.category) errors.category = 'Required'
    if (!formData.whatsappNumber.trim()) errors.whatsappNumber = 'Required'
    if (!formData.location.trim()) errors.location = 'Required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files)

    const newImages = files.slice(0, MAX_IMAGES - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      id: `img-${Date.now()}-${Math.random()}`
    }))

    setImages(prev => [...prev, ...newImages])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    const submissionData = { 
      ...formData,
      ownerUid: user?.uid,
      cleanWhatsapp: formData.whatsappNumber.replace(/\D/g, ''),
      price: Number(formData.price),
      images,
      deliveryLink: formData.deliveryOption === 'KOB Express Delivery' ? GOOGLE_FORM_URL : null
    }

    onSubmit(submissionData)
  }

  if (checkingStatus) return <Loading />

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">

        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
        <Textarea name="description" value={formData.description} onChange={handleChange} />
        <Input name="price" type="number" value={formData.price} onChange={handleChange} />
        <Input name="location" value={formData.location} onChange={handleChange} />
        <Input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />

        {/* ✅ Seller KOB ID - read-only */}
        <Input 
          name="sellerIDNumber" 
          value={formData.sellerIDNumber} 
          readOnly
          placeholder="Seller KOB ID"
        />

        {/* IMAGE INPUT */}
        <div>
          <label className="font-bold">Product Images (max 5)</label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded mt-2"
          />

          {/* PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {images.map(img => (
                <div key={img.id} className="relative">
                  <img src={img.preview} className="h-24 w-full object-cover rounded" />

                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading || uploadingImage}>
          {loading ? 'Processing...' : 'Submit'}
        </Button>

      </form>
    </Card>
  )
}
