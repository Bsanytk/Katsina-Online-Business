import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import { logoutUser } from '../firebase/auth'

export default function TopBar() {
  const { user } = useAuth()

  async function handleLogout() {
    try {
      await logoutUser()
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  return (
    <header className="bg-kob-primary text-white">
      <div className="container flex items-center justify-between">
        <nav className="flex gap-4 items-center">
          <Link to="/" className="font-semibold">KOB</Link>
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/marketplace" className="hover:underline">Marketplace</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          {(user && (user.role === 'admin' || user.role === 'verified')) && (
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={handleLogout} className="px-3 py-1 bg-white text-kob-primary rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 bg-white text-kob-primary rounded">Login</Link>
              <Link to="/register" className="px-3 py-1 border border-white rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
