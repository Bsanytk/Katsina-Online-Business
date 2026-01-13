import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white text-kob-dark p-4 rounded-lg shadow-sm">
      <h4 className="font-semibold mb-3">Dashboard</h4>
      <ul className="space-y-2">
        <li><Link to="/dashboard" className="hover:underline">Overview</Link></li>
        <li><Link to="/dashboard/products" className="hover:underline">Products</Link></li>
      </ul>
    </aside>
  )
}
