/**
 * TeamMemberModal.jsx — KOB Team Detail Modal
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { teamAvatar, fallbackAvatar } from '../../services/cloudinary'

export default function TeamMemberModal({ member, onClose }) {
  const [imgError, setImgError] = useState(false)

  if (!member) return null

  const imgSrc = imgError
    ? fallbackAvatar(member.name)
    : teamAvatar(member.image, 400)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end
          md:items-center justify-center
          bg-black/60 backdrop-blur-sm p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0,      opacity: 1 }}
          exit={{    y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md
            rounded-t-3xl md:rounded-3xl overflow-hidden
            shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Photo header */}
          <div className="relative h-64 bg-[#4B3621]
            flex-shrink-0 overflow-hidden">
            <img
              src={imgSrc}
              alt={member.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top
                opacity-80"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t
              from-[#2C1F0E]/90 via-[#4B3621]/20 to-transparent" />

            {/* Name on photo */}
            <div className="absolute bottom-0 left-0 right-0
              px-6 pb-5">
              <div className="flex items-end justify-between">
                <div>
                  {member.verified && (
                    <div className="flex items-center gap-1.5
                      mb-1.5">
                      <span className="flex items-center gap-1
                        px-2.5 py-1 bg-[#D4AF37] text-[#2C1F0E]
                        rounded-full text-[10px] font-black">
                        <svg className="w-3 h-3"
                          fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0
                            001.745-.723 3.066 3.066 0 013.976
                            0 3.066 3.066 0 001.745.723 3.066
                            3.066 0 012.812 2.812c.051.643.304
                            1.254.723 1.745a3.066 3.066 0 010
                            3.976 3.066 3.066 0 00-.723 1.745
                            3.066 3.066 0 01-2.812 2.812 3.066
                            3.066 0 00-1.745.723 3.066 3.066 0
                            01-3.976 0 3.066 3.066 0 00-1.745-.723
                            3.066 3.066 0 01-2.812-2.812 3.066
                            3.066 0 00-.723-1.745 3.066 3.066 0
                            010-3.976 3.066 3.066 0 00.723-1.745
                            3.066 3.066 0 012.812-2.812zm7.44
                            5.252a1 1 0 00-1.414-1.414L9 10.586
                            7.707 9.293a1 1 0 00-1.414 1.414l2
                            2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd" />
                        </svg>
                        KOB Verified Member
                      </span>
                    </div>
                  )}
                  <h2 className="text-xl font-black text-white
                    leading-tight">
                    {member.name}
                  </h2>
                  <p className="text-[#D4AF37] text-sm
                    font-semibold">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9
                bg-black/30 backdrop-blur-sm text-white
                rounded-xl flex items-center justify-center
                hover:bg-black/50 transition-colors
                touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor"
                strokeWidth={2.5}>
                <path strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5
            overscroll-contain">

            {/* Bio */}
            {member.bio && (
              <div className="mb-5">
                <p className="text-xs font-bold uppercase
                  tracking-widest text-[#D4AF37] mb-2">
                  About
                </p>
                <p className="text-sm text-gray-600
                  leading-relaxed">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Contact */}
            <div>
              <p className="text-xs font-bold uppercase
                tracking-widest text-[#D4AF37] mb-3">
                Connect
              </p>
              <div className="space-y-2.5">

                {member.whatsapp && (
                  <a
                    href={`https://wa.me/${member.whatsapp}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3
                      bg-[#25D366]/10 border border-[#25D366]/20
                      rounded-2xl hover:bg-[#25D366]/20
                      transition-colors touch-manipulation group"
                  >
                    <div className="w-9 h-9 bg-[#25D366]
                      rounded-xl flex items-center justify-center
                      text-white flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
                        1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
                        0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
                        4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-700">
                        WhatsApp
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        +{member.whatsapp}
                      </p>
                    </div>
                  </a>
                )}

                {member.email && (
                  <a href={`mailto:${member.email}`}
                    className="flex items-center gap-3 p-3
                      bg-[#4B3621]/5 border border-[#4B3621]/10
                      rounded-2xl hover:bg-[#4B3621]/10
                      transition-colors touch-manipulation">
                    <div className="w-9 h-9 bg-[#4B3621]
                      rounded-xl flex items-center justify-center
                      text-white flex-shrink-0">
                      <svg className="w-4 h-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor"
                        strokeWidth={2}>
                        <path strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5
                          19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2
                          0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-700">
                        Email
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                  </a>
                )}

                {member.instagram && (
                  <a href={member.instagram}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 p-3
                      bg-pink-50 border border-pink-100
                      rounded-2xl hover:bg-pink-100
                      transition-colors touch-manipulation">
                    <div className="w-9 h-9 bg-gradient-to-br
                      from-purple-600 to-pink-500 rounded-xl
                      flex items-center justify-center
                      text-white flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012
                        4.85.07 3.252.148 4.771 1.691 4.919
                        4.919.058 1.265.069 1.645.069 4.849 0
                        3.205-.012 3.584-.069 4.849-.149
                        3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204
                        0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849
                        0-3.204.013-3.583.07-4.849.149-3.227
                        1.664-4.771 4.919-4.919
                        1.266-.057 1.645-.069
                        4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78
                        2.618-6.98 6.98-.059 1.281-.073 1.689-.073
                        4.948 0 3.259.014 3.668.072 4.948.2 4.358
                        2.618 6.78 6.98 6.98 1.281.058 1.689.072
                        4.948.072 3.259 0 3.668-.014
                        4.948-.072 4.354-.2 6.782-2.618
                        6.979-6.98.059-1.28.073-1.689.073-4.948
                        0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0
                        5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759
                        6.163 6.162 6.163 6.162-2.759
                        6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0
                        10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4
                        4-4s4 1.791 4 4c0 2.21-1.791 4-4
                        4zm6.406-11.845c-.796 0-1.441.645-1.441
                        1.44s.645 1.44 1.441 1.44c.795 0
                        1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-700">
                        Instagram
                      </p>
                      <p className="text-[10px] text-gray-400">
                        View profile
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
