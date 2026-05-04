import React, { useState, useEffect } from 'react'
import {
  getAllProducts,
  bulkUpdateProducts,
  bulkDeleteProducts,
} from '../../services/admin'
import {
  AlertTriangle, Clock, EyeOff,
  Trash2, CheckSquare, Square, RefreshCw,
} from 'lucide-react'

// ================================
// Expiry helpers
// ================================
function getDaysUntilExpiry(expiryDate) {
  if (!expiryDate) return null
  return Math.ceil(
    (new Date(expiryDate) - new Date()) /
    (1000 * 60 * 60 * 24)
  )
}

function expiryBadge(days) {
  if (days === null) return null
  if (days < 0)   return { label: 'Expired',     cls: 'bg-red-100 text-red-700' }
  if (days <= 7)  return { label: `${days}d`,     cls: 'bg-red-100 text-red-700' }
  if (days <= 30) return { label: `${days}d`,     cls: 'bg-amber-100 text-amber-700' }
  return              { label: `${days}d`,         cls: 'bg-emerald-100 text-emerald-700' }
}

export default function InventoryPanel() {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [filter, setFilter]           = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getAllProducts({ pageSize: 100 })
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter((p) => {
    if (filter === 'all')      return true
    if (filter === 'live')     return !p.isDraft
    if (filter === 'draft')    return p.isDraft
    if (filter === 'lowstock')
      return p.stockCount !== undefined && p.stockCount < 5
    if (filter === 'expiring') {
      const d = getDaysUntilExpiry(p.expiryDate)
      return d !== null && d <= 30
    }
    return true
  })

  const lowStockItems = products.filter(
    (p) => p.stockCount !== undefined && p.stockCount < 5
  )
  const expiringItems = products.filter((p) => {
    const d = getDaysUntilExpiry(p.expiryDate)
    return d !== null && d <= 30
  })

  function toggleOne(id) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    )
  }

  function toggleAll() {
    setSelected(
      selected.length === filtered.length
        ? []
        : filtered.map((p) => p.id)
    )
  }

  async function bulkHide() {
    if (!selected.length) return
    if (!window.confirm(`Hide ${selected.length} products?`)) return
    setBulkLoading(true)
    try {
      await bulkUpdateProducts(selected, { isDraft: true })
      await load()
      setSelected([])
    } finally {
      setBulkLoading(false)
    }
  }

  async function bulkDelete() {
    if (!selected.length) return
    if (!window.confirm(
      `Permanently delete ${selected.length} products?`
    )) return
    setBulkLoading(true)
    try {
      await bulkDeleteProducts(selected)
      await load()
      setSelected([])
    } finally {
      setBulkLoading(false)
    }
  }

  return (
    <div className="space-y-5">

      {/* Alert banners */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-3 p-4
              bg-red-50 border border-red-100 rounded-2xl">
              <div className="w-10 h-10 bg-red-100 rounded-xl
                flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Low Stock Alert
                </p>
                <p className="text-xs text-red-500">
                  {lowStockItems.length} product{lowStockItems.length !== 1 ? 's' : ''} running low
                </p>
              </div>
              <button
                onClick={() => setFilter('lowstock')}
                className="text-xs font-semibold text-red-600
                  hover:underline flex-shrink-0"
              >
                View →
              </button>
            </div>
          )}

          {expiringItems.length > 0 && (
            <div className="flex items-center gap-3 p-4
              bg-amber-50 border border-amber-100 rounded-2xl">
              <div className="w-10 h-10 bg-amber-100 rounded-xl
                flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-700">
                  Expiry Alert
                </p>
                <p className="text-xs text-amber-500">
                  {expiringItems.length} item{expiringItems.length !== 1 ? 's' : ''} expiring within 30 days
                </p>
              </div>
              <button
                onClick={() => setFilter('expiring')}
                className="text-xs font-semibold text-amber-600
                  hover:underline flex-shrink-0"
              >
                View →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border
        border-gray-100 shadow-sm overflow-hidden">

        {/* Controls */}
        <div className="flex flex-col md:flex-row
          md:items-center justify-between gap-3
          px-5 py-4 border-b border-gray-100">

          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              { id: 'all',      label: 'All' },
              { id: 'live',     label: '🟢 Live' },
              { id: 'draft',    label: '📝 Draft' },
              { id: 'lowstock', label: '⚠️ Low Stock' },
              { id: 'expiring', label: '⏰ Expiring' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-xl
                  text-[10px] font-semibold transition-all
                  ${filter === f.id
                    ? 'bg-[#4B3621] text-white'
                    : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Bulk actions */}
            {selected.length > 0 && (
              <>
                <span className="text-xs text-gray-400">
                  {selected.length} selected
                </span>
                <button
                  onClick={bulkHide}
                  disabled={bulkLoading}
                  className="flex items-center gap-1.5
                    px-3 py-1.5 bg-amber-50 text-amber-700
                    rounded-xl text-xs font-semibold
                    hover:bg-amber-100 transition-colors
                    disabled:opacity-50"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide
                </button>
                <button
                  onClick={bulkDelete}
                  disabled={bulkLoading}
                  className="flex items-center gap-1.5
                    px-3 py-1.5 bg-red-50 text-red-600
                    rounded-xl text-xs font-semibold
                    hover:bg-red-100 transition-colors
                    disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}

            {/* Refresh */}
            <button
              onClick={load}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200
                text-gray-400 hover:text-[#4B3621]
                hover:border-[#4B3621] transition-all
                disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4
                ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">
            Loading inventory...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-semibold
                  uppercase tracking-widest text-gray-400
                  bg-gray-50/50">
                  <th className="py-3 px-5 text-left">
                    <button onClick={toggleAll}>
                      {selected.length === filtered.length &&
                       filtered.length > 0
                        ? <CheckSquare className="w-4 h-4 text-[#4B3621]" />
                        : <Square className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-left">Expiry</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}
                      className="py-14 text-center
                        text-xs text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const days   = getDaysUntilExpiry(p.expiryDate)
                    const badge  = expiryBadge(days)
                    const isLow  =
                      p.stockCount !== undefined &&
                      p.stockCount < 5

                    return (
                      <tr key={p.id}
                        className="hover:bg-gray-50/50
                          transition-colors">
                        <td className="py-3 px-5">
                          <button onClick={() => toggleOne(p.id)}>
                            {selected.includes(p.id)
                              ? <CheckSquare className="w-4 h-4 text-[#4B3621]" />
                              : <Square className="w-4 h-4 text-gray-300" />
                            }
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.imageUrl ||
                                p.images?.[0] ||
                                '/placeholder.png'
                              }
                              className="w-9 h-9 rounded-lg
                                object-cover border border-gray-100
                                flex-shrink-0"
                              alt=""
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium
                                text-gray-700 truncate max-w-[150px]">
                                {p.title}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {p.sellerIDNumber || '—'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold
                            text-[#D4AF37]">
                            ₦{Number(p.price).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {p.stockCount !== undefined ? (
                            <span className={`text-xs font-semibold
                              ${isLow
                                ? 'text-red-600'
                                : 'text-gray-600'
                              }`}>
                              {isLow && '⚠ '}
                              {p.stockCount}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">
                              —
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {badge ? (
                            <span className={`inline-flex
                              px-2 py-1 rounded-full
                              text-[10px] font-semibold
                              ${badge.cls}`}>
                              {badge.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">
                              —
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex
                            px-2.5 py-1 rounded-full
                            text-[10px] font-semibold
                            ${p.isDraft
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                            }`}>
                            {p.isDraft ? 'Draft' : 'Live'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-50
          bg-gray-50/50">
          <p className="text-[10px] text-gray-400">
            {filtered.length} of {products.length} products
            {selected.length > 0 && ` · ${selected.length} selected`}
          </p>
        </div>
      </div>
    </div>
  )
}