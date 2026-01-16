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
    <main className="min-h-screen bg-kob-light">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Customer Testimonials</h1>
          <p className="text-xl md:text-2xl opacity-95 font-light max-w-3xl mx-auto">
            Hear from real buyers and sellers who are transforming their businesses with KOB.
          </p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card variant="elevated" className="p-8 rounded-xl text-center card-hover">
            <div className="text-6xl font-bold text-kob-primary mb-3">10K+</div>
            <p className="text-gray-600 text-lg font-semibold">Active Users</p>
          </Card>
          <Card variant="elevated" className="p-8 rounded-xl text-center card-hover">
            <div className="text-6xl font-bold text-kob-primary mb-3">50K+</div>
            <p className="text-gray-600 text-lg font-semibold">Products Listed</p>
          </Card>
          <Card variant="elevated" className="p-8 rounded-xl text-center card-hover">
            <div className="text-6xl font-bold text-kob-primary mb-3">⭐ 4.8/5</div>
            <p className="text-gray-600 text-lg font-semibold">Average Rating</p>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-kob-dark mb-12 text-center">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} variant="elevated" className="p-8 rounded-xl card-hover animate-fade-in h-full flex flex-col">
                {/* Star Rating */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 italic mb-6 text-base leading-relaxed flex-grow">"{testimonial.text}"</p>

                {/* Author */}
                <div className="border-t border-kob-neutral-200 pt-6 mt-auto">
                  <p className="font-bold text-lg text-kob-dark">{testimonial.name}</p>
                  <p className="text-sm text-kob-primary font-semibold">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 md:p-16 text-center shadow-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl opacity-95 mb-10 font-light">Join thousands of satisfied buyers and sellers transforming commerce on KOB.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button
              onClick={() => window.location.href = '/register'}
              size="lg"
              variant="primary"
              className="bg-white text-kob-primary hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start as Buyer
            </Button>
            <Button
              onClick={() => window.location.href = '/register'}
              size="lg"
              variant="primary"
              className="bg-white text-kob-primary hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start as Seller
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
