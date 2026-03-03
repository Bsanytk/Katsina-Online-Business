import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './firebase/auth'
import TopBar from './layouts/TopBar'
import Footer from './layouts/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import SupportWidget from './components/widgets/SupportWidget'

// lazy load large pages for performance
const Home = lazy(() => import('./pages/Home'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Help = lazy(() => import('./pages/Help'))
const Teams = lazy(() => import('./pages/Teams'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-kob-light text-kob-dark">
        {/* Sticky Header */}
        <TopBar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
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
          </Suspense>
        </main>
        {/* Footer */}
        <Footer />

        {/* Floating Support Widget */}
        <SupportWidget />
      </div>
    </AuthProvider>
  )
}
