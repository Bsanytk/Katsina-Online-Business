import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Textarea, Alert } from '../ui'
import Loading from '../Loading'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../firebase/auth'
import { getUserProfile } from '../../services/users' 

/**
 * ProductForm Component - Updated with KOB ID, Location, Delivery, and WhatsApp
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
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    whatsappNumber: '',
    location: '',            // Added Location
    sellerIDNumber: '',      // Added KOB ID (e.g. KOB-001)
    deliveryOption: 'KOB Express Delivery', // Added Delivery Choice
    isDraft: true,
  })
  
  const [images, setImages] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [isVerified, setIsVerified] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const MAX_IMAGES = 5
  const isEditMode = initialData !== null
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform?usp=header";

  // --- Logic: Check Verification Status ---
  useEffect(() => {
    async function checkSellerStatus() {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid)
          setIsVerified(profile?.isVerified === true)
        } catch (err) {
          console.error("Error fetching user status:", err)
        }
      }
      setCheckingStatus(false)
    }
    checkSellerStatus()
  }, [user])

  // --- Logic: Sync form with initialData ---
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        category: initialData.category || '',
        whatsappNumber: initialData.whatsappNumber || '',
        location: initialData.location || '',
        sellerIDNumber: initialData.sellerIDNumber || '',
        deliveryOption: initialData.deliveryOption || 'KOB Express Delivery',
        isDraft: initialData.isDraft ?? true,
      })

      if (initialData.images && Array.isArray(initialData.images)) {
        setImages(
          initialData.images.map((img, idx) => ({
            id: img.id || `existing-${idx}`,
            preview: typeof img === 'string' ? img : img.url || img.secure_url,
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

  // --- Validation Logic ---
  function validateForm() {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Product title is required'
    if (!formData.description.trim() || formData.description.length < 10) errors.description = 'Description must be at least 10 characters'
    const price = Number(formData.price)
    if (!formData.price || isNaN(price) || price <= 0) errors.price = 'Enter a valid price'
    if (!formData.category) errors.category = 'Category is required'
    if (!formData.whatsappNumber.trim()) errors.whatsappNumber = 'WhatsApp number is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    if (!formData.sellerIDNumber.trim()) errors.sellerIDNumber = 'KOB ID is required'
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user?.uid) {
      alert("You must be Logged in")
      return
    }
    if (!validateForm()) return
    
    // Auto-attach Google Form link if KOB Express is chosen
    const submissionData = { 
      ...formData, 
      ownerUid: user?.uid,
      cleanWhatsapp: formData.whatsappNumber.replace(/\D/g, ''),
      price: parseFloat(formData.price),
      images,
      deliveryLink: formData.deliveryOption === 'KOB Express Delivery' ? GOOGLE_FORM_URL : null
    }
    onSubmit(submissionData)
  }

  // --- Verification Lock Screen ---
   if (checkingStatus) return <div className="p-10 text-center"><Loading size="md" /></div>
  if (!isVerified && !isEditMode) {
    return (
      <Card variant="outlined" className="p-10 text-center border-2 border-amber-200 bg-amber-50 rounded-2xl shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-4 rounded-full">
            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-black text-amber-900 mb-2">Account Not Verified</h2>
        <p className="text-amber-700 mb-8 max-w-md mx-auto leading-relaxed">
          Sorry! Only <strong>verified sellers</strong> can post products on KOB Marketplace. 
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/2347089454544" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg">Chat with Admin</a>
          <button onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform')} className="px-8 py-3 bg-kob-primary text-white rounded-xl font-bold shadow-lg">Verification Form</button>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className="p-6 border-t-4 border-kob-primary">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-kob-dark mb-2">
          {isEditMode ? '✏️ Edit Product' : '🚀 Post New Product'}
        </h2>

        {/* Draft/Live Toggle */}
        <div className={`p-4 rounded-lg border ${formData.isDraft ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.isDraft} onChange={() => setFormData(p => ({...p, isDraft: !p.isDraft}))} className="w-5 h-5 rounded accent-kob-primary" />
            <span className={`font-bold ${formData.isDraft ? 'text-amber-900' : 'text-green-900'}`}>
              {formData.isDraft ? '📝 Save as Draft' : '🚀 Publish Live'}
            </span>
          </label>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Title" name="title" value={formData.title} onChange={handleChange} error={validationErrors.title} placeholder="e.g. Quality Roba Shoes" />
            <Input label="KOB ID (🆔)" name="sellerIDNumber" value={formData.sellerIDNumber} onChange={handleChange} error={validationErrors.sellerIDNumber} placeholder="e.g. KOB-001" />
          </div>

          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={4} error={validationErrors.description} placeholder="Size, Color, Quality..." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Price (₦)" name="price" type="number" value={formData.price} onChange={handleChange} error={validationErrors.price} />
            <Input label="Location (📍)" name="location" value={formData.location} onChange={handleChange} error={validationErrors.location} placeholder="e.g. Metropolis, Katsina" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-kob-dark mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={`w-full px-4 py-2 border-2 rounded-lg ${validationErrors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <Input label="WhatsApp (Contact)" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} error={validationErrors.whatsappNumber} placeholder="e.g. 234806..." />
          </div>

          {/* Delivery Method Radio Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-kob-dark">Delivery Method</label>
            <div className="flex gap-4 p-4 border rounded-xl bg-gray-50 border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-green-700">
                <input type="radio" name="deliveryOption" value="KOB Express Delivery" checked={formData.deliveryOption === 'KOB Express Delivery'} onChange={handleChange} className="accent-green-600 w-4 h-4" />
                🚚 KOB Express
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="radio" name="deliveryOption" value="Others" checked={formData.deliveryOption === 'Others'} onChange={handleChange} className="accent-gray-600 w-4 h-4" />
                Others
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
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
            
