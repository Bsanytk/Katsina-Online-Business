import React, { useState } from 'react'
import { toggleSellerVerification } from '../../services/admin'
import {
  CheckCircle, XCircle, MessageCircle,
  Search, ExternalLink, ChevronRight,
} from 'lucide-react'

// ================================
// WhatsApp contact link
// ================================
function WALink({ number, name, role }) {
  if (!number) return (
    <span className="text-xs text-gray-300">No number</span>
  )
  const msg = encodeURIComponent(
    `Hello ${name}, this is KOB Admin contacting you ` +
    `regarding your ${role} account on KOB Marketplace.`
  )
  return (
    <a
      href={`https://wa.me/${number}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 text-xs
        font-medium text-emerald-600
        hover:text-emerald-700 transition-colors"
    >
      <MessageCircle className="w-3.5 h-3.5" />
      WhatsApp
    </a>
  )
}

export default function CRMTable({
  sellers, buyers, onRefresh
}) {
  const [view, setView]           = useState('sellers')
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [verifying, setVerifying] = useState(null)

  const data = view === 'sellers' ? sellers : buyers

  const filtered = data.filter((u) => {
    const matchSearch =
      !search ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.kobNumber?.toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === 'all' ||
      (filter === 'verified'  && u.isVerified) ||
      (filter === 'pending'   && !u.isVerified)

    return matchSearch && matchFilter
  })

  async function handleVerify(userId, current) {
    setVerifying(userId)
    try {
      await toggleSellerVerification(userId, current)
      onRefresh()
    } catch (err) {
      alert('Failed: ' + err.message)
    } finally {
      setVerifying(null)
    }
  }

  const verifiedCount = sellers.filter((s) => s.isVerified).length
  const pendingCount  = sellers.filter((s) => !s.isVerified).length

  return (
    <div className="space-y-5">

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sellers', value: sellers.length,
            color: 'text-[#4B3621]' },
          { label: 'Verified',      value: verifiedCount,
            color: 'text-emerald-600' },
          { label: 'Pending',       value: pendingCount,
            color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-xl border
              border-gray-100 p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>
              {s.value}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5
              uppercase tracking-wider font-medium">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border
        border-gray-100 shadow-sm overflow-hidden">

        {/* Controls */}
        <div className="flex flex-col md:flex-row
          md:items-center justify-between gap-3
          px-5 py-4 border-b border-gray-100">

          {/* Toggle */}
          <div className="flex gap-1 bg-gray-100
            rounded-xl p-1 w-fit">
            {['sellers', 'buyers'].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v)
                  setSearch('')
                  setFilter('all')
                }}
                className={`
                  px-4 py-1.5 rounded-lg text-xs
                  font-semibold capitalize transition-all
                  ${view === v
                    ? 'bg-white text-[#4B3621] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {v} (
                {v === 'sellers'
                  ? sellers.length
                  : buyers.length}
                )
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2
                -translate-y-1/2 w-3.5 h-3.5 text-gray-400
                pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200
                  rounded-xl text-xs outline-none
                  focus:border-[#4B3621] transition-colors w-44"
              />
            </div>

            {/* Filter */}
            {view === 'sellers' && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200
                  rounded-xl text-xs outline-none
                  focus:border-[#4B3621] cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            )}
          </div>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-semibold
                uppercase tracking-widest text-gray-400
                bg-gray-50/50">
                <th className="text-left py-3 px-5">Name</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">KOB ID</th>
                {view === 'sellers' && (
                  <>
                    <th className="text-left py-3 px-4">
                      Status
                    </th>
                    <th className="text-right py-3 px-5">
                      Action
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}
                    className="py-12 text-center
                      text-xs text-gray-400">
                    No {view} found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}
                    className="hover:bg-gray-50/50
                      transition-colors">

                    {/* Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full
                          bg-[#4B3621] flex items-center
                          justify-center flex-shrink-0">
                          <span className="text-white text-xs
                            font-bold">
                            {(u.displayName || u.email)
                              ?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold
                            text-gray-700 truncate max-w-[120px]">
                            {u.displayName || 'No Name'}
                          </p>
                          <p className="text-[10px] text-gray-400
                            truncate max-w-[120px]">
                            {u.businessName || u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <WALink
                        number={u.whatsappNumber || u.phoneNumber}
                        name={u.displayName || 'User'}
                        role={u.role}
                      />
                    </td>

                    {/* KOB ID */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-mono
                        text-[#4B3621] font-semibold">
                        {u.kobNumber || '—'}
                      </span>
                    </td>

                    {/* Sellers only */}
                    {view === 'sellers' && (
                      <>
                        <td className="py-3.5 px-4">
                          {u.isVerified ? (
                            <span className="inline-flex
                              items-center gap-1 px-2.5 py-1
                              bg-emerald-50 text-emerald-700
                              rounded-full text-[10px]
                              font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex
                              items-center gap-1 px-2.5 py-1
                              bg-amber-50 text-amber-700
                              rounded-full text-[10px]
                              font-semibold">
                              <XCircle className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() =>
                              handleVerify(u.id, u.isVerified)
                            }
                            disabled={verifying === u.id}
                            className={`
                              px-3 py-1.5 rounded-lg
                              text-[10px] font-semibold
                              transition-all disabled:opacity-50
                              ${u.isVerified
                                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                                : 'bg-[#4B3621] text-white hover:bg-[#362818]'
                              }
                            `}
                          >
                            {verifying === u.id
                              ? '...'
                              : u.isVerified
                                ? 'Revoke'
                                : 'Verify'
                            }
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-50
          bg-gray-50/50">
          <p className="text-[10px] text-gray-400">
            Showing {filtered.length} of {data.length} {view}
          </p>
        </div>
      </div>
    </div>
  )
}