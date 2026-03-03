import React, { useState, useEffect } from 'react'
import { Card } from '../ui'
import OrderList from '../orders/OrderList'
import OrderDetail from '../orders/OrderDetail'
import { getBuyerOrders, getSellerOrders } from '../../services/orders'
import { useAuth } from '../../firebase/auth'

/**
 * OrdersTab Component
 * Dashboard tab for viewing and managing orders
 * For buyers: shows purchased items and status
 * For sellers: shows sales and allows status updates
 */
export default function OrdersTab() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isSeller = user?.role === 'seller'

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)
    const fetchOrders = isSeller ? getSellerOrders(user.uid) : getBuyerOrders(user.uid)

    fetchOrders
      .then((data) => {
        setOrders(data)
        if (data.length > 0) {
          setSelectedOrder(data[0])
        }
        setError(null)
      })
      .catch((err) => {
        console.error('Error fetching orders:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [user?.uid, isSeller])

  const handleStatusUpdate = (updatedOrder) => {
    setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
    setSelectedOrder(updatedOrder)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card variant="outlined" className="p-6 rounded-lg bg-red-50 border-red-200">
        <div className="text-red-700 font-semibold">Error loading orders</div>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Orders List */}
      <div className="lg:col-span-1">
        <h3 className="font-bold text-lg text-kob-dark mb-4">
          {isSeller ? 'My Sales' : 'My Orders'} ({orders.length})
        </h3>
        <OrderList orders={orders} isSeller={isSeller} onSelectOrder={setSelectedOrder} />
      </div>

      {/* Order Detail */}
      <div className="lg:col-span-2">
        <h3 className="font-bold text-lg text-kob-dark mb-4">Order Details</h3>
        <OrderDetail order={selectedOrder} isSeller={isSeller} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  )
}
