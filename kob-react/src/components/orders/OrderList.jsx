import React, { useState, useEffect } from 'react'
import { Card } from '../ui'

/**
 * OrderList Component
 * Display list of orders (buyer's purchased or seller's sales)
 */
export default function OrderList({ orders = [], isSeller = false, onSelectOrder }) {
  const [selectedId, setSelectedId] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'closed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleSelectOrder = (order) => {
    setSelectedId(order.id)
    if (onSelectOrder) {
      onSelectOrder(order)
    }
  }

  if (!orders || orders.length === 0) {
    return (
      <Card variant="outlined" className="p-8 rounded-lg text-center">
        <p className="text-gray-600">{isSeller ? 'No sales yet' : 'No orders yet'}</p>
        <p className="text-sm text-gray-500 mt-2">
          {isSeller ? 'Your sold products will appear here' : 'Your purchased items will appear here'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card
          key={order.id}
          variant={selectedId === order.id ? 'elevated' : 'outlined'}
          className={`p-5 rounded-lg cursor-pointer transition-all ${
            selectedId === order.id ? 'bg-kob-light border-kob-primary' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleSelectOrder(order)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-bold text-kob-dark">Order #{order.id?.slice(-8).toUpperCase()}</h4>

              {/* Product Name */}
              <p className="text-sm text-gray-700 mt-1">{order.productName}</p>

              {/* Buyer/Seller Name */}
              <p className="text-xs text-gray-600 mt-1">
                {isSeller ? '👤 Buyer: ' : '👤 Seller: '}
                {isSeller ? order.buyerName : order.sellerName}
              </p>
            </div>

            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex-shrink-0 ${getStatusColor(order.status)}`}>
              {order.status?.toUpperCase()}
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 text-xs">Quantity</span>
              <p className="font-bold text-kob-primary">{order.quantity}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Total</span>
              <p className="font-bold text-kob-primary">₦{order.totalPrice?.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600 text-xs">Date</span>
              <p className="font-bold text-kob-dark">
                {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-600 text-xs">Last Updated</span>
              <p className="font-bold text-kob-dark">
                {new Date(order.updatedAt?.toDate?.() || order.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
