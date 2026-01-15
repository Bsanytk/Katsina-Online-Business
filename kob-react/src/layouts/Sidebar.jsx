import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../firebase/auth'

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'bg-kob-primary text-white' : 'text-kob-dark hover:bg-gray-100'

  return (
    <aside className="w-full lg:w-56 bg-white text-kob-dark p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="text-xl">📊</span> Dashboard
      </h3>
      
      <nav className="space-y-2">
        <Link 
          to="/dashboard" 
          className={`block px-4 py-2 rounded-md transition-colors font-medium ${isActive('/dashboard')}`}
        >
          📈 Overview
        </Link>
        
        {user?.role === 'admin' && (
          <Link 
            to="/dashboard/products" 
            className={`block px-4 py-2 rounded-md transition-colors font-medium ${isActive('/dashboard/products')}`}
          >
            📦 All Products
          </Link>
        )}

        {(user?.role === 'admin' || user?.role === 'verified') && (
          <Link 
            to="/dashboard/add-product" 
            className={`block px-4 py-2 rounded-md transition-colors font-medium ${isActive('/dashboard/add-product')}`}
          >
            ➕ Add Product
          </Link>
        )}
      </nav>

      {/* Role Badge */}
      <div className="mt-6 p-3 bg-kob-light rounded-md">
        <p className="text-xs font-semibold text-gray-600">YOUR ROLE</p>
        <p className="text-lg font-bold text-kob-primary mt-1 capitalize">
          {user?.role === 'admin' ? '👑 Admin' : user?.role === 'verified' ? '✓ Seller' : 'Member'}
        </p>
      </div>
    </aside>
  )
}
