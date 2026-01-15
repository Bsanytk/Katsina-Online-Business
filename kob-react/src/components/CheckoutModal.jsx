import React, { useState } from 'react'
import { Card, Button, Input, Alert } from '../ui'
import {
  initializePayment,
  calculateFees,
  formatCurrency,
  PAYMENT_METHODS,
} from '../../services/payment'
import { analytics } from '../../services/analytics'

/**
 * CheckoutModal Component
 * Handles product purchase and payment processing
 * 
 * Props:
 *   - product: Product object to purchase
 *   - seller: Seller information
 *   - user: Current user
 *   - onClose: Callback when modal closes
 *   - onSuccess: Callback after successful payment
 */
export default function CheckoutModal({
  product,
  user,
  onClose = () => {},
  onSuccess = () => {},
}) {
  const [step, setStep] = useState(1) // 1: delivery, 2: payment
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.email?.split('@')[0] || '',
    phone: '',
    address: '',
    city: 'Katsina',
    state: 'Katsina',
  })
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [orderId] = useState(() => `KOB-${Math.random().toString(36).substr(2, 9)}`)

  const baseAmount = product.price
  const fees = calculateFees(baseAmount)
  const totalAmount = fees.total

  function handleDeliveryChange(e) {
    const { name, value } = e.target
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function validateDelivery() {
    if (!deliveryInfo.fullName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!deliveryInfo.phone.trim()) {
      setError('Please enter a phone number')
      return false
    }
    if (!deliveryInfo.address.trim()) {
      setError('Please enter a delivery address')
      return false
    }
    return true
  }

  function handleProceedToPayment() {
    setError(null)
    if (validateDelivery()) {
      setStep(2)
      // Track checkout step
      analytics.trackEvent('begin_checkout', {
        value: totalAmount,
        currency: 'NGN',
        items: [
          {
            item_name: product.title,
            item_price: baseAmount,
          },
        ],
      })
    }
  }

  function handlePayment() {
    setError(null)
    setLoading(true)

    try {
      initializePayment({
        email: user?.email || deliveryInfo.phone,
        amount: totalAmount,
        productTitle: product.title,
        orderId,
        customerName: deliveryInfo.fullName,
        onSuccess: (response) => {
          // Track purchase
          analytics.trackPurchase(orderId, [product], totalAmount)

          setLoading(false)
          onSuccess?.({
            ...response,
            deliveryInfo,
            product,
            totalAmount,
          })
          onClose()
        },
        onError: (errorMsg) => {
          setError(errorMsg)
          setLoading(false)
        },
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-kob-primary to-kob-gold text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {step === 1 ? '📦 Delivery' : '💳 Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-75"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Alert */}
          {error && <Alert type="error">{error}</Alert>}

          {/* Step 1: Delivery Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-kob-dark mb-4">
                Enter Delivery Details
              </h3>

              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={deliveryInfo.fullName}
                onChange={handleDeliveryChange}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={deliveryInfo.phone}
                onChange={handleDeliveryChange}
                required
              />

              <Input
                label="Delivery Address"
                name="address"
                type="text"
                placeholder="Street address..."
                value={deliveryInfo.address}
                onChange={handleDeliveryChange}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  type="text"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryChange}
                  disabled
                />
                <Input
                  label="State"
                  name="state"
                  type="text"
                  value={deliveryInfo.state}
                  onChange={handleDeliveryChange}
                  disabled
                />
              </div>

              {/* Product Summary */}
              <Card variant="outlined" className="p-4 bg-blue-50">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{product.title}</span>
                    <span className="font-semibold">{formatCurrency(baseAmount)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-gray-600">
                    <span>Paystack fees</span>
                    <span>{formatCurrency(fees.totalFee)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-kob-primary">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </Card>

              {/* Seller Info */}
              <Card variant="outlined" className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Seller Information</h4>
                <p className="text-sm text-gray-600">
                  Seller will contact you on WhatsApp to confirm delivery details
                </p>
              </Card>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-kob-dark mb-4">
                Choose Payment Method
              </h3>

              {/* Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      selectedPayment === method.id
                        ? 'border-kob-primary bg-blue-50'
                        : 'border-gray-200 hover:border-kob-primary'
                    }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{method.description}</p>
                  </button>
                ))}
              </div>

              {/* Payment Summary */}
              <Card variant="outlined" className="p-4 bg-green-50">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Product</span>
                    <span>{formatCurrency(baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Payment fees</span>
                    <span>+{formatCurrency(fees.totalFee)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-kob-primary text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </Card>

              {/* Important Note */}
              <Alert type="info" title="💡 Important">
                Payment is handled securely by Paystack. You'll be charged{' '}
                <strong>{formatCurrency(totalAmount)}</strong>. The seller will be notified
                upon successful payment and contact you via WhatsApp.
              </Alert>

              {/* Delivery Summary */}
              <Card variant="outlined" className="p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Delivery To:</h4>
                <p className="text-sm text-gray-700">
                  {deliveryInfo.fullName}
                  <br />
                  {deliveryInfo.address}
                  <br />
                  {deliveryInfo.city}, {deliveryInfo.state}
                  <br />
                  {deliveryInfo.phone}
                </p>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                ← Back
              </Button>
            )}
            {step === 1 && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleProceedToPayment}
                className={step === 1 ? 'flex-1' : ''}
              >
                Continue to Payment
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
                disabled={loading}
                className="flex-1"
              >
                {loading ? '⏳ Processing...' : '💳 Complete Payment'}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
