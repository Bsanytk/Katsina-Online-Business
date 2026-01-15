import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './firebase/auth'
import TopBar from './layouts/TopBar'
import Footer from './layouts/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import SupportWidget from './components/widgets/SupportWidget'

import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Help from './pages/Help'
import Teams from './pages/Teams'
import Testimonials from './pages/Testimonials'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-kob-light text-kob-dark">
        {/* Sticky Header */}
        <TopBar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<Help />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

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

        {/* Footer */}
        <Footer />

        {/* Floating Support Widget */}
        <SupportWidget />
      </div>
    </AuthProvider>
  )
}
