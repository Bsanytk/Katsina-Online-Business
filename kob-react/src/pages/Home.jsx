import React, { useEffect, useState } from 'react'
import { getProducts } from '../services/products'
import ProductCard from '../components/ProductCard'
import Loading from '../components/Loading'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((items) => {
      setProducts(items.slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main className="container">
      <section className="text-center py-8">
        <h1 className="text-3xl font-bold text-kob-dark">Katsina Online Business</h1>
        <p className="mt-3 text-gray-700">Buy and sell local products from verified sellers.</p>
        <div className="mt-6">
          <a href="/marketplace" className="px-4 py-2 bg-kob-primary text-white rounded">Visit Marketplace</a>
        </div>
      </section>

      <section className="py-6">
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </main>
  )
}
