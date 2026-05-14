/**
 * TeamCard.jsx — uses existing cloudinary.js uploadImage pattern
 * avatarUrl() from extended cloudinary.js
 */

import React, { useState } from 'react'
import { motion }           from 'framer-motion'
import { avatarUrl, fallbackAvatar } from '../../services/cloudinary'

export default function TeamCard({ member, onSelect, index = 0 }) {
  const [imgError, setImgError] = useState(false)

  const src = imgError || !member.image
    ? fallbackAvatar(member.name, 300)
    : avatarUrl(member.image, 300)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect?.(member)}
      className="group bg-white rounded-3xl overflow-hidden
        border border-gray-100 shadow-sm cursor-pointer
        hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden
        bg-gray-100">
        <img
          src={src}
          alt={member.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top
            group-hover:scale-105 transition-transform
            duration-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-[#2C1F0E]/70 via-transparent to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300" />

        {/* Verified */}
        {member.verified && (
          <div className="absolute top-3 right-3
            flex items-center gap-1 px-2.5 py-1
            bg-[#D4AF37] text-[#2C1F0E] rounded-full
            text-[10px] font-black shadow-lg">
            <svg className="w-3 h-3" fill="currentColor"
              viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723
                3.066 3.066 0 013.976 0 3.066 3.066 0
                001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304
                1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0
                00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066
                0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0
                00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0
                00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0
                00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1
                1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0
                00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd" />
            </svg>
            KOB
          </div>
        )}

        {/* Hover socials */}
        <div className="absolute bottom-0 left-0 right-0
          p-3 flex justify-center gap-2
          opacity-0 group-hover:opacity-100
          translate-y-3 group-hover:translate-y-0
          transition-all duration-300">
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp}`}
              target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 bg-[#25D366] text-white
                rounded-xl flex items-center justify-center
                hover:scale-110 transition-transform shadow-lg
                touch-manipulation"
            >
              <svg className="w-4 h-4" fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
                1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
                0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
                4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
              </svg>
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 bg-[#4B3621] text-white
                rounded-xl flex items-center justify-center
                hover:scale-110 transition-transform shadow-lg
                touch-manipulation"
            >
              <svg className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2
                  2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2
                  0 002 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#2C1F0E]
          leading-tight truncate mb-0.5">
          {member.name}
        </h3>
        <p className="text-xs text-[#D4AF37] font-semibold
          truncate mb-2">
          {member.role}
        </p>
        {member.bio && (
          <p className="text-xs text-gray-400 line-clamp-2
            leading-relaxed">
            {member.bio}
          </p>
        )}
      </div>
    </motion.div>
  )
}
