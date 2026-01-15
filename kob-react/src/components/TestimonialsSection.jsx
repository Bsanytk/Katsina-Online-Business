import React from 'react'
import { Card } from './ui'

/**
 * TestimonialsSection Component
 * Display user testimonials and success stories
 */
export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Amina Hassan',
      role: 'Buyer',
      image: '👩‍💼',
      text: 'KOB made it so easy to find quality products in Katsina. The sellers are professional and respond quickly on WhatsApp. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Ahmed Ibrahim',
      role: 'Seller',
      image: '👨‍🏪',
      text: 'I\'ve been selling on KOB for 3 months and my sales have tripled! The platform is user-friendly and reaches thousands of customers.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Zainab Mohammmed',
      role: 'Buyer',
      image: '👩‍💻',
      text: 'Found exactly what I was looking for at great prices. The variety of products available is amazing. Shipping communication was excellent!',
      rating: 5,
    },
    {
      id: 4,
      name: 'Musa Yusuf',
      role: 'Seller',
      image: '🧑‍💼',
      text: 'Listing my products was so simple. I appreciate how many buyers browse the marketplace. My inventory turns over quickly on KOB.',
      rating: 5,
    },
    {
      id: 5,
      name: 'Hadiza Abubakar',
      role: 'Buyer',
      image: '👩‍🎓',
      text: 'Great platform for discovering local businesses. I\'ve bought several items and everything arrived in perfect condition. Best online marketplace in Katsina!',
      rating: 5,
    },
    {
      id: 6,
      name: 'Karim Hassan',
      role: 'Seller',
      image: '👨‍💻',
      text: 'The support team is responsive and helpful. They answered all my questions about setting up my shop. Definitely worth trying if you\'re a seller.',
      rating: 5,
    },
  ]

  function renderStars(count) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={i <= count ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-kob-dark mb-4">
            💬 What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied buyers and sellers who trust KOB for their marketplace needs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} variant="elevated" className="p-6 flex flex-col">
              {/* Stars */}
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 flex-grow italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t pt-4 flex items-center gap-3">
                <div className="text-3xl">{testimonial.image}</div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-kob-primary font-medium">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-kob-primary mb-2">5,000+</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-kob-primary mb-2">10,000+</p>
            <p className="text-gray-600">Products Listed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-kob-primary mb-2">4.8★</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-kob-primary to-kob-gold text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 text-white opacity-90">
              Join our thriving marketplace and start buying or selling today
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/register"
                className="px-6 py-3 bg-white text-kob-primary rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Create Account
              </a>
              <a
                href="/marketplace"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
