import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './firebase/auth'
import TopBar from './layouts/TopBar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'

function NotFound() {
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold">Page not found</h2>
    </main>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-kob-light text-kob-dark">
        <TopBar />
        <main className="container py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
