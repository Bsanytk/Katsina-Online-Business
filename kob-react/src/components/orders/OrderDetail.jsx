import React, { useState } from 'react'
import { Card, Button, Select } from '../ui'
import { updateOrderStatus } from '../services/orders'

/**
 * OrderDetail Component
 * Display detailed order information with status timeline
 */
export default function OrderDetail({ order, isSeller = false, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(order?.status || 'pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!order) {
    return (
      <Card variant="outlined" className="p-8 rounded-lg text-center">
        <p className="text-gray-600">Select an order to view details</p>
      </Card>
    )
  }

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'confirmed':
        return '✓'
      case 'shipped':
        return '📦'
      case 'delivered':
        return '✓✓'
      case 'cancelled':
        return '✗'
      default:
        return '•'
    }
  }

  const handleStatusUpdate = async () => {
    if (newStatus === order.status || !isSeller) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateOrderStatus(order.id, newStatus)
      if (onStatusUpdate) {
        onStatusUpdate({ ...order, status: newStatus })
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" className="p-6 rounded-lg bg-gradient-to-br from-kob-light to-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-kob-dark mb-2">Order #{order.id?.slice(-8).toUpperCase()}</h3>
            <p className="text-sm text-gray-600">
              {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-kob-primary">₦{order.totalPrice?.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">{order.quantity} item(s)</p>
          </div>
        </div>
      </Card>

      {/* Product & Parties */}
      <Card variant="outlined" className="p-6 rounded-lg">
        <h4 className="font-bold text-kob-dark mb-4">Order Summary</h4>
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <label className="text-xs font-semibold text-gray-600 uppercase">Product</label>
            <p className="font-bold text-kob-dark mt-1">{order.productName}</p>
            <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity}</p>
            <p className="text-sm text-gray-600">Unit Price: ₦{(order.totalPrice / order.quantity)?.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">Buyer</label>
              <p className="font-bold text-kob-dark mt-1">{order.buyerName}</p>
              <p className="text-sm text-gray-600 mt-1">{order.buyerEmail}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">Seller</label>
              <p className="font-bold text-kob-dark mt-1">{order.sellerName}</p>
              <p className="text-sm text-gray-600 mt-1">{order.sellerEmail}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Status Timeline */}
      <Card variant="outlined" className="p-6 rounded-lg">
        <h4 className="font-bold text-kob-dark mb-4">Status Timeline</h4>
        <div className="space-y-3">
          {statusOptions.map((status, idx) => {
            const isCompleted = statusOptions.indexOf(order.status) >= statusOptions.indexOf(status)
            const isCurrent = status === order.status

            return (
              <div key={status} className="flex items-start gap-4">
                {/* Timeline Dot & Line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-300 text-white'
                    }`}
                  >
                    {getStatusIcon(status)}
                  </div>
                  {idx < statusOptions.length - 1 && (
                    <div
                      className={`w-1 h-6 mt-1 ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>

                {/* Status Info */}
                <div className="flex-1 pt-1">
                  <p className={`font-semibold ${isCurrent ? 'text-yellow-700' : isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                    {status.toUpperCase()}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(order.updatedAt?.toDate?.() || order.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Status Update Form (Seller Only) */}
      {isSeller && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <Card variant="outlined" className="p-6 rounded-lg bg-blue-50 border-blue-200">
          <h4 className="font-bold text-blue-900 mb-4">Update Order Status</h4>

          {error && (
            <div className="p-3 mb-4 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              Status updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <Select
              label="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={statusOptions.filter((s) => statusOptions.indexOf(s) >= statusOptions.indexOf(order.status)).map((s) => ({
                value: s,
                label: s.toUpperCase(),
              }))}
              disabled={loading}
            />

            <Button
              onClick={handleStatusUpdate}
              disabled={loading || newStatus === order.status}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </Card>
      )}

      {/* Read-Only Status (Buyer) */}
      {!isSeller && (
        <Card variant="outlined" className="p-6 rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            📦 You will be notified when the seller updates the status of your order.
          </p>
        </Card>
      )}
    </div>
  )
}
