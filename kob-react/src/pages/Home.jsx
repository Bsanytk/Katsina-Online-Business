import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/products'
import { useTranslation } from '../hooks/useTranslation'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'
import { Button, Card } from '../components/ui'
import TestimonialsSection from '../components/TestimonialsSection'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const t = useTranslation()

  useEffect(() => {
    getProducts().then((items) => {
      setProducts(items.slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-kob-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Katsina Online Business
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Discover authentic local products from verified sellers. Support your community while shopping quality goods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/marketplace')}
              size="lg"
              variant="primary"
            >
              Explore Marketplace
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              size="lg"
              variant="ghost"
              className="border-white text-white hover:bg-white hover:text-kob-primary"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-kob-dark mb-12">Why Choose KOB?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🏪', title: 'Verified Sellers', desc: 'Buy from trusted local merchants' },
              { icon: '✅', title: 'Quality Products', desc: 'Authentic goods with great value' },
              { icon: '💬', title: 'Direct Contact', desc: 'Message sellers via WhatsApp instantly' },
            ].map((feature, i) => (
              <Card key={i} variant="elevated" hover className="text-center">
                <div className="text-5xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-lg text-kob-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-kob-dark">Featured Products</h2>
            <Button
              onClick={() => navigate('/marketplace')}
              variant="ghost"
              className="text-kob-primary"
            >
              View All →
            </Button>
          </div>

          {loading ? (
            <Loading message="Loading featured products..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map(p => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">No products available yet. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-kob-dark text-white py-12 md:py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Sell Your Products?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community of verified sellers and reach thousands of customers across Katsina.
          </p>
          <a
            href={t('seller.forms.seller_registration')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              size="lg"
              variant="primary"
            >
              Become a Seller
            </Button>
          </a>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  )
}
