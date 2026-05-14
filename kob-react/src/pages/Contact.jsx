/**
 * Contact.jsx — KOB Professional Contact Page
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from '../components/ui/useAlert'

// ================================
// SVG Icons
// ================================
const Icons = {
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
      1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
      0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
      4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438
      5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477
      10-10S17.523 2 12 2z" />
    </svg>
  ),
  Email: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0
        002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1
        1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516
        5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0
        01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Location: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827
        0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112
        2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003
        9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03
        9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Store: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3
        6h18M16 10a4 4 0 01-8 0" />
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
}

// ================================
// Contact cards data
// ================================
const CONTACTS = [
  {
    icon:    <Icons.WhatsApp />,
    title:   'WhatsApp Support',
    value:   '+234 708 945 4544',
    desc:    'Fastest response — typically within minutes',
    href:    'https://wa.me/2347089454544',
    bg:      'bg-[#25D366]/10',
    iconBg:  'bg-[#25D366]',
    border:  'border-[#25D366]/20',
    cta:     'Chat Now',
  },
  {
    icon:    <Icons.Email />,
    title:   'Email Support',
    value:   'support@kobmarketplace.com',
    desc:    'Detailed inquiries — response within 24 hours',
    href:    'mailto:support@kobmarketplace.com',
    bg:      'bg-[#4B3621]/5',
    iconBg:  'bg-[#4B3621]',
    border:  'border-[#4B3621]/10',
    cta:     'Send Email',
  },
  {
    icon:    <Icons.Phone />,
    title:   'Phone Support',
    value:   '+234 708 945 4544',
    desc:    'Business hours: Mon–Sat, 8am–6pm WAT',
    href:    'tel:+2347089454544',
    bg:      'bg-blue-50',
    iconBg:  'bg-blue-600',
    border:  'border-blue-100',
    cta:     'Call Now',
  },
]

const SUPPORT_CATEGORIES = [
  { icon: '🛒', title: 'Buyer Support',       desc: 'Order issues, payments, returns'       },
  { icon: '🏪', title: 'Seller Support',      desc: 'Listings, verification, KOB ID'        },
  { icon: '🛡️', title: 'Safety & Fraud',      desc: 'Report scams, suspicious activity'     },
  { icon: '💳', title: 'Account & Billing',   desc: 'Profile, settings, account issues'     },
  { icon: '🚚', title: 'KOB Express',         desc: 'Delivery tracking and inquiries'        },
  { icon: '⚖️', title: 'Legal & Compliance',  desc: 'Terms, privacy, disputes'              },
]

const RESPONSE_TIMES = [
  { channel: 'WhatsApp',       time: '< 30 minutes',  available: true  },
  { channel: 'Phone',          time: '< 1 hour',       available: true  },
  { channel: 'Email',          time: '< 24 hours',     available: true  },
  { channel: 'Legal Matters',  time: '3–5 business days', available: true },
]

// ================================
// Quick Contact Form
// ================================
function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [sending, setSend]  = useState(false)
  const { success, error }  = useAlert()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      error('Incomplete Form', 'Please fill in all fields.')
      return
    }
    setSend(true)
    // Simulate send — replace with real API
    await new Promise((r) => setTimeout(r, 1500))
    setSend(false)
    success('Message Sent!', 'We will get back to you shortly.')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase
            tracking-wide text-gray-500 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Your name"
            className="w-full px-4 py-3 border-2 border-gray-200
              rounded-xl text-sm outline-none
              focus:border-[#4B3621] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase
            tracking-wide text-gray-500 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((p) => ({ ...p, email: e.target.value }))
            }
            placeholder="your@email.com"
            className="w-full px-4 py-3 border-2 border-gray-200
              rounded-xl text-sm outline-none
              focus:border-[#4B3621] transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase
          tracking-wide text-gray-500 mb-1.5">
          Message
        </label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) =>
            setForm((p) => ({ ...p, message: e.target.value }))
          }
          placeholder="How can we help you?"
          className="w-full px-4 py-3 border-2 border-gray-200
            rounded-xl text-sm outline-none resize-none
            focus:border-[#4B3621] transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full flex items-center justify-center
          gap-2 py-3.5 bg-[#4B3621] text-white rounded-xl
          text-sm font-bold hover:bg-[#362818]
          transition-colors shadow-sm disabled:opacity-60
          touch-manipulation"
      >
        {sending ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none"
              viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12"
                r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Icons.Send />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

// ================================
// Main Contact Page
// ================================
export default function Contact() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">

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
            <span className="w-2 h-2 rounded-full
              bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase
              tracking-widest text-[#D4AF37]">
              Support Team Online
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black
            text-white mb-4 tracking-tight">
            We're Here to{' '}
            <span className="text-[#D4AF37]">Help</span>
          </h1>

          <p className="text-base text-white/60 max-w-md
            mx-auto mb-8 leading-relaxed">
            Have a question, issue, or feedback?
            KOB Support is ready — choose your preferred
            contact method below.
          </p>

          {/* Quick CTA */}
          <a
            href="https://wa.me/2347089454544"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2.5
              px-7 py-3.5 bg-[#25D366] text-white rounded-xl
              text-sm font-black hover:bg-[#1ebc5c]
              transition-colors shadow-xl
              shadow-[#25D366]/20"
          >
            <Icons.WhatsApp />
            Get Instant Support
          </a>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto
        px-4 py-12 pb-24 space-y-12">

        {/* ================================ */}
        {/* CONTACT CARDS                    */}
        {/* ================================ */}
        <section>
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase
              tracking-widest text-[#D4AF37] mb-2">
              Contact Options
            </p>
            <h2 className="text-2xl font-black text-[#2C1F0E]">
              Reach the KOB Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACTS.map((c) => (
              <div key={c.title}
                className={`
                  ${c.bg} border ${c.border}
                  rounded-3xl p-5 hover:shadow-lg
                  hover:-translate-y-0.5 transition-all
                  duration-200 group
                `}>
                <div className={`w-12 h-12 ${c.iconBg}
                  rounded-2xl flex items-center justify-center
                  text-white mb-4 group-hover:scale-110
                  transition-transform`}>
                  {c.icon}
                </div>
                <h3 className="text-sm font-bold text-[#2C1F0E]
                  mb-1">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold
                  text-[#4B3621] mb-1 break-all">
                  {c.value}
                </p>
                <p className="text-xs text-gray-400 mb-4
                  leading-relaxed">
                  {c.desc}
                </p>
                <a
                  href={c.href}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5
                    text-xs font-bold text-[#4B3621]
                    hover:text-[#D4AF37] transition-colors"
                >
                  {c.cta} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ================================ */}
        {/* SUPPORT CATEGORIES              */}
        {/* ================================ */}
        <section className="grid grid-cols-1 lg:grid-cols-2
          gap-8">

          <div>
            <p className="text-xs font-black uppercase
              tracking-widest text-[#D4AF37] mb-3">
              Support Categories
            </p>
            <h2 className="text-xl font-black text-[#2C1F0E]
              mb-5">
              What Do You Need Help With?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORT_CATEGORIES.map((cat) => (
                <a
                  key={cat.title}
                  href="https://wa.me/2347089454544"
                  target="_blank" rel="noreferrer"
                  className="flex items-start gap-3 p-4
                    bg-white rounded-2xl border border-gray-100
                    shadow-sm hover:shadow-md
                    hover:border-[#4B3621]/20
                    transition-all duration-200 group"
                >
                  <span className="text-xl flex-shrink-0">
                    {cat.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold
                      text-[#2C1F0E] mb-0.5 group-hover:text-[#4B3621]
                      leading-tight">
                      {cat.title}
                    </p>
                    <p className="text-[10px] text-gray-400
                      leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Response Times */}
          <div>
            <p className="text-xs font-black uppercase
              tracking-widest text-[#D4AF37] mb-3">
              Response Times
            </p>
            <h2 className="text-xl font-black text-[#2C1F0E]
              mb-5">
              How Fast We Respond
            </h2>
            <div className="space-y-3">
              {RESPONSE_TIMES.map((r) => (
                <div key={r.channel}
                  className="flex items-center justify-between
                    p-4 bg-white rounded-2xl border border-gray-100
                    shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full
                      bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-semibold
                      text-[#2C1F0E]">
                      {r.channel}
                    </span>
                  </div>
                  <span className="text-xs font-bold
                    text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1
                    rounded-lg">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Office info */}
            <div className="mt-5 p-4 bg-[#4B3621]/5
              border border-[#4B3621]/10 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#4B3621] rounded-xl
                  flex items-center justify-center text-white
                  flex-shrink-0">
                  <Icons.Location />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2C1F0E]
                    mb-0.5">
                    KOB Marketplace
                  </p>
                  <p className="text-xs text-gray-500
                    leading-relaxed">
                    Katsina State, Nigeria
                    <br />
                    Operating across all LGAs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
                           
        {/* ================================ */}
        {/* FAQ + LEGAL LINKS                */}
        {/* ================================ */}
        <section className="grid grid-cols-1 md:grid-cols-2
          gap-4">

          <div className="bg-white rounded-3xl border
            border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#2C1F0E]
              mb-4 flex items-center gap-2">
              <span>❓</span>
              Quick FAQ Links
            </h3>
            <div className="space-y-2">
              {[
                { q: 'How do I become a verified seller?', to: '/faq' },
                { q: 'How does KOB Express work?',         to: '/faq' },
                { q: 'How do I report a fraud?',           to: '/faq' },
                { q: 'What is a KOB ID?',                  to: '/faq' },
              ].map((item) => (
                <Link key={item.q} to={item.to}
                  className="flex items-center gap-2 text-xs
                    text-gray-500 hover:text-[#4B3621]
                    py-2 border-b border-gray-50
                    transition-colors touch-manipulation">
                  <span className="w-1.5 h-1.5 rounded-full
                    bg-[#D4AF37] flex-shrink-0" />
                  {item.q}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border
            border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-[#2C1F0E]
              mb-4 flex items-center gap-2">
              <span>📋</span>
              Legal & Policies
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Terms of Service',      to: '/terms'   },
                { label: 'Privacy Policy',        to: '/privacy' },
                { label: 'Marketplace Safety',    to: '/terms'   },
                { label: 'Community Guidelines',  to: '/terms'   },
              ].map((link) => (
                <Link key={link.label} to={link.to}
                  className="flex items-center gap-2 text-xs
                    text-gray-500 hover:text-[#4B3621]
                    py-2 border-b border-gray-50
                    transition-colors touch-manipulation">
                  <span className="w-1.5 h-1.5 rounded-full
                    bg-[#4B3621] flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
     
