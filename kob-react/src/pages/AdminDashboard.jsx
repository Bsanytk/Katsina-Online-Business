import React, { useState, useEffect } from 'react'
import { getAllSellers, toggleSellerVerification } from '../services/admin'
import { Card, Alert } from '../components/ui'

export default function AdminDashboard() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchSellers()
  }, [])

  async function fetchSellers() {
    try {
      const data = await getAllSellers()
      setSellers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(userId, currentStatus) {
    try {
      await toggleSellerVerification(userId, currentStatus)
      setMessage({ type: 'success', text: "Seller status updated successfully!" })
      fetchSellers() // Refresh the list
    } catch (err) {
      setMessage({ type: 'error', text: "Failed to update status." })
    }
  }

  return (
    <div className="container py-10 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-kob-dark">KOB Admin Panel</h1>
        <p className="text-gray-500">Manage sellers and marketplace verification status.</p>
      </header>

      {message && (
        <Alert type={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <Card className="overflow-hidden border-none shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-kob-dark text-white">
            <tr>
              <th className="p-4 font-bold uppercase text-xs">Seller Name</th>
              <th className="p-4 font-bold uppercase text-xs">Email/UID</th>
              <th className="p-4 font-bold uppercase text-xs">Status</th>
              <th className="p-4 font-bold uppercase text-xs text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-800">
                  {seller.displayName || 'No Name'}
                </td>
                <td className="p-4 text-xs text-gray-400">
                  {seller.email || seller.id}
                </td>
                <td className="p-4">
                  {seller.isVerified ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold italic">
                      Verified ✅
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                      Pending ⏳
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleVerify(seller.id, seller.isVerified)}
                    className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                      seller.isVerified 
                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                        : 'bg-kob-primary text-white hover:scale-105'
                    }`}
                  >
                    {seller.isVerified ? 'REVOKE VERIFICATION' : 'VERIFY SELLER'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {loading && <div className="p-10 text-center animate-pulse">Loading sellers...</div>}
        {!loading && sellers.length === 0 && <div className="p-10 text-center">No sellers found.</div>}
      </Card>
    </div>
  )
}