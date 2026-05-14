/**
 * Teams.jsx — KOB Professional Team Page
 */

import React, { useState } from 'react'
import TeamCard from '../components/team/TeamCard'
import TeamMemberModal from '../components/team/TeamMemberModal'

// ================================
// Team Data — scalable structure
// ================================
const TEAM = [
  {
    id:        1,
    name:      'Sulaiman Babangida Sani',
    role:      'Founder & CEO',
    image:
      'https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png',
    whatsapp:  '2347089454544',
    facebook:  'https://facebook.com',
    instagram: 'https://instagram.com',
    email:     'ceo@kobmarketplace.com',
    bio:       'Visionary behind KOB Marketplace. Dedicated to empowering Katsina businesses through technology and digital commerce.',
    verified:  true,
  },
  {
    id:        2,
    name:      'Fatima Aliyu',
    role:      'Head of Operations',
    image:     '',
    whatsapp:  '2348012345678',
    facebook:  'https://facebook.com',
    instagram: 'https://instagram.com',
    email:     'ops@kobmarketplace.com',
    bio:       'Oversees day-to-day marketplace operations, seller onboarding, and customer experience excellence.',
    verified:  true,
  },
  {
    id:        3,
    name:      'Abdullahi Musa',
    role:      'Lead Developer',
    image:     '',
    whatsapp:  '2348023456789',
    facebook:  'https://facebook.com',
    instagram: 'https://instagram.com',
    email:     'dev@kobmarketplace.com',
    bio:       'Builds and maintains KOB platform infrastructure. Passionate about scalable marketplace technology.',
    verified:  true,
  },
  {
    id:        4,
    name:      'Aisha Ibrahim',
    role:      'Marketing Director',
    image:     '',
    whatsapp:  '2348034567890',
    facebook:  'https://facebook.com',
    instagram: 'https://instagram.com',
    email:     'marketing@kobmarketplace.com',
    bio:       'Drives KOB brand awareness and seller growth across Katsina State through digital and community marketing.',
    verified:  false,
  },
  {
    id:        5,
    name:      'Umar Faruk',
    role:      'Safety & Compliance',
    image:     '',
    whatsapp:  '2348045678901',
    facebook:  'https://facebook.com',
    instagram: null,
    email:     'safety@kobmarketplace.com',
    bio:       'Ensures marketplace integrity, fraud prevention, and community standard compliance.',
    verified:  true,
  },
  {
    id:        6,
    name:      'Hafsat Danjuma',
    role:      'Customer Success',
    image:     '',
    whatsapp:  '2348056789012',
    facebook:  'https://facebook.com',
    instagram: 'https://instagram.com',
    email:     'support@kobmarketplace.com',
    bio:       'Champions buyer and seller satisfaction, resolves disputes, and improves the KOB support experience.',
    verified:  false,
  },
]

const STATS = [
  { value: '6+',  label: 'Team Members'     },
  { value: '50+', label: 'Verified Sellers' },
  { value: '1K+', label: 'Happy Buyers'     },
  { value: '3+',  label: 'Years Building'   },
]

export default function Teams() {
  const [selectedMember, setSelectedMember] = useState(null)

  return (
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* Modal */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* ================================ */}
      {/* HERO                             */}
      {/* ================================ */}
      <section className="relative overflow-hidden
        bg-gradient-to-br from-[#2C1F0E] via-[#4B3621]
        to-[#6B4C31] py-20 text-white">
        <div className="absolute -top-16 -right-16 w-72 h-72
          bg-[#D4AF37]/10 rounded-full blur-3xl
          pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72
          bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 max-w-4xl
          mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4
            py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30
            rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]
              animate-pulse" />
            <span className="text-xs font-bold uppercase
              tracking-widest text-[#D4AF37]">
              KOB Core Team
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black
            text-white mb-4 tracking-tight">
            The People Behind{' '}
            <span className="text-[#D4AF37]">KOB</span>
          </h1>

          <p className="text-base text-white/60 max-w-lg
            mx-auto mb-10 leading-relaxed">
            A dedicated team of builders, operators, and
            community advocates transforming commerce in
            Katsina State.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4
            gap-4 max-w-xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label}
                className="text-center">
                <p className="text-3xl font-black text-[#D4AF37]">
                  {s.value}
                </p>
                <p className="text-[10px] text-white/40 uppercase
                  tracking-widest font-semibold mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================ */}
      {/* TEAM GRID                        */}
      {/* ================================ */}
      <section className="container max-w-6xl mx-auto
        px-4 py-14 pb-24">

        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase
            tracking-widest text-[#D4AF37] mb-2">
            Our Team
          </p>
          <h2 className="text-2xl md:text-3xl font-black
            text-[#2C1F0E]">
            Builders of KOB
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Tap any card to learn more and connect.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3
          lg:grid-cols-3 gap-4 md:gap-6">
          {TEAM.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              onSelect={setSelectedMember}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 relative overflow-hidden
          rounded-3xl bg-gradient-to-br from-[#2C1F0E]
          via-[#4B3621] to-[#6B4C31] p-8 md:p-12
          text-center text-white">
          <div className="absolute -top-12 -right-12 w-48 h-48
            bg-[#D4AF37]/10 rounded-full blur-3xl
            pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase
              tracking-widest text-[#D4AF37] mb-3">
              Join the Mission
            </p>
            <h3 className="text-2xl font-black text-white mb-3">
              Want to Join KOB?
            </h3>
            <p className="text-sm text-white/60 mb-6
              max-w-sm mx-auto">
              We are always looking for passionate people
              to help build Katsina's leading marketplace.
            </p>
            <a
              href="https://wa.me/2347089454544"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-7
                py-3 bg-[#D4AF37] text-[#2C1F0E] rounded-xl
                text-sm font-black hover:bg-[#c49e30]
                transition-colors shadow-lg"
            >
              💬 Chat With Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
