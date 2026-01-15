import React from 'react'
import { Button, Card } from '../components/ui'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Zainab M.',
      role: 'Fashion Seller',
      text: 'KOB gave me the platform to reach customers I could never have reached before. My sales have tripled in just 3 months!',
      rating: 5
    },
    {
      id: 2,
      name: 'Ibrahim K.',
      role: 'Electronics Buyer',
      text: 'Great selection and fair prices. The interface is user-friendly and delivery is fast. Highly recommended!',
      rating: 5
    },
    {
      id: 3,
      name: 'Amina S.',
      role: 'Home Goods Seller',
      text: 'The support team is incredibly helpful. They helped me set up my store and I got my first sale within a week.',
      rating: 5
    },
    {
      id: 4,
      name: 'Hassan A.',
      role: 'Regular Buyer',
      text: 'I love the verified sellers badge. It gives me confidence when buying. KOB is my go-to marketplace.',
      rating: 5
    },
    {
      id: 5,
      name: 'Bilkisu J.',
      role: 'Artisan Seller',
      text: 'As a small business owner, KOB\'s low fees and easy setup made all the difference. Thank you for supporting local!',
      rating: 5
    },
    {
      id: 6,
      name: 'Musa T.',
      role: 'Frequent Buyer',
      text: 'Quality products, reasonable prices, and excellent customer service. This is how online shopping should be!',
      rating: 5
    }
  ]

  return (
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-kob-dark mb-4">Customer Testimonials</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from real buyers and sellers who are transforming their businesses with KOB.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-kob-primary mb-2">10K+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-kob-primary mb-2">50K+</div>
            <p className="text-gray-600">Products Listed</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl font-bold text-kob-primary mb-2">⭐ 4.8/5</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} variant="elevated" hover className="p-6">
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic mb-4 text-sm">"{testimonial.text}"</p>

              {/* Author */}
              <div className="border-t pt-4">
                <p className="font-bold text-kob-dark">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-kob-primary to-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">Join thousands of satisfied buyers and sellers on KOB.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/register'}
              size="lg"
              variant="primary"
              className="bg-white text-kob-primary hover:bg-gray-100"
            >
              Start as Buyer
            </Button>
            <Button
              onClick={() => window.location.href = '/register'}
              size="lg"
              variant="primary"
              className="bg-white text-kob-primary hover:bg-gray-100"
            >
              Start as Seller
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
