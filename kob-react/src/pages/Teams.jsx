import React from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Card } from '../components/ui'

export default function Teams() {
  const t = useTranslation()
  
  const teamMembers = [
    {
      id: 1,
      name: 'Abdullahi Sanusi',
      role: 'Founder & CEO',
      bio: 'Digital entrepreneur with 5+ years in e-commerce and startup ecosystem.',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Team Member 2',
      role: 'Head of Operations',
      bio: 'Operations expert ensuring smooth marketplace function and seller success.',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Team Member 3',
      role: 'Lead Developer',
      bio: 'Full-stack engineer building scalable, modern marketplace technology.',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Team Member 4',
      role: 'Community Manager',
      bio: 'Supporting buyers and sellers, building a thriving marketplace community.',
      avatar: '👩‍🤝‍👨'
    }
  ]

  return (
    <main className="min-h-screen bg-kob-light pt-8 pb-16">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-kob-dark mb-4">Our Team</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Passionate individuals working to revolutionize e-commerce in Katsina and beyond.
          </p>
        </div>

        {/* Mission Section */}
        <Card variant="elevated" className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-kob-dark mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At Katsina Online Business (KOB), we're committed to empowering local entrepreneurs and connecting buyers and sellers in a secure, transparent digital marketplace. We believe in the potential of small and medium businesses to thrive with the right technology and support.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our team is dedicated to building trust, ensuring fair competition, and providing world-class service to all our users.
          </p>
        </Card>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teamMembers.map((member) => (
            <Card key={member.id} variant="elevated" hover className="p-6 text-center">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className="text-lg font-bold text-kob-dark">{member.name}</h3>
              <p className="text-kob-primary font-semibold text-sm mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card variant="elevated" className="p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-bold text-kob-dark mb-2">Trust & Transparency</h3>
            <p className="text-gray-600 text-sm">
              We build trust through transparent operations and fair treatment of all users.
            </p>
          </Card>
          <Card variant="elevated" className="p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-kob-dark mb-2">Innovation</h3>
            <p className="text-gray-600 text-sm">
              We continuously innovate to improve the marketplace experience for everyone.
            </p>
          </Card>
          <Card variant="elevated" className="p-6">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-lg font-bold text-kob-dark mb-2">Empowerment</h3>
            <p className="text-gray-600 text-sm">
              We empower entrepreneurs with tools and support to succeed online.
            </p>
          </Card>
        </div>

        {/* Recruitment Section */}
        <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white rounded-lg p-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Join Our Growing Team</h2>
              <p className="text-lg opacity-90 mb-6">
                We're expanding and looking for passionate individuals to join KOB as riders, field agents, and partners.
              </p>
              <p className="opacity-85 mb-4">
                Whether you're looking for flexible work opportunities or want to be part of a revolutionary marketplace, we'd love to hear from you.
              </p>
            </div>
            <div className="flex flex-col gap-4 justify-center">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">🏍️ Riders & Delivery Partners</h3>
                <p className="text-sm opacity-90 mb-4">Help deliver orders across Katsina and surrounding areas</p>
                <a
                  href={t('seller.forms.rider_agent')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-white text-kob-primary font-semibold rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  Apply Now →
                </a>
              </div>
              <div className="bg-white bg-opacity-20 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">🚀 Field Agents</h3>
                <p className="text-sm opacity-90 mb-4">Support sellers and expand KOB's presence locally</p>
                <a
                  href={t('seller.forms.rider_agent')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-white text-kob-primary font-semibold rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
