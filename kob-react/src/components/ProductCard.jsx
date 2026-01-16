import React, { useState } from 'react'
import { useAuth } from '../firebase/auth'

export default function ProductCard({ product, user, onEdit, onDelete, onBuyClick }) {
  const { user: authUser } = useAuth()
  const canEdit = user && user.role === 'admin'
  const [imageError, setImageError] = useState(false)

  // Placeholder image for failed image loads
  const imagePlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23d3d3d3" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3EImage unavailable%3C/text%3E%3C/svg%3E'
  
  const displayImage = imageError || !product.imageURL ? imagePlaceholder : product.imageURL

  function handleImageError() {
    setImageError(true)
  }

  // WhatsApp contact URL
  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in your product:\n\n${product.title}\nPrice: ₦${product.price || 'N/A'}\n\nCould you tell me more?`
  )
  const whatsappLink = `https://wa.me/?text=${whatsappMessage}`

  return (
    <article className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:translate-y-[-4px] overflow-hidden flex flex-col h-full animate-fade-in border border-kob-neutral-200">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-kob-neutral-200 to-kob-neutral-300 overflow-hidden group">
        <img 
          src={displayImage} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
        />
        {/* Badge Overlay */}
        <div className="absolute top-3 right-3 bg-kob-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          New
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-kob-dark line-clamp-2 mb-2 leading-snug">{product.title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed">{product.description}</p>
        
        {/* Category Badge */}
        {product.category && (
          <span className="inline-block badge-primary mb-3 w-fit">
            {product.category}
          </span>
        )}
        
        {/* Price */}
        <div className="mb-4 pb-4 border-b border-kob-neutral-200">
          <p className="text-sm text-gray-500 mb-1">Price</p>
          <div className="text-2xl font-bold bg-gradient-to-r from-kob-primary to-kob-gold bg-clip-text text-transparent">
            ₦{product.price?.toLocaleString() || '—'}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {/* Buy Now Button */}
          {authUser && authUser.role === 'buyer' && (
            <button
              onClick={() => onBuyClick?.(product)}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-kob-primary to-kob-primary-dark hover:shadow-lg hover:shadow-kob-primary/30 text-white rounded-lg font-semibold transition-all duration-200 text-sm transform hover:scale-105"
            >
              🛒 Buy Now
            </button>
          )}

          {/* WhatsApp Contact Button */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2.5 bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30 text-white rounded-lg font-semibold transition-all duration-200 text-sm transform hover:scale-105"
          >
            💬 Chat
          </a>
          
          {/* Edit/Delete for Admins */}
          {canEdit && (
            <>
              <button 
                onClick={() => onEdit && onEdit(product)} 
                className="px-3 py-2.5 bg-kob-primary hover:bg-kob-primary-dark text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              >
                ✎ Edit
              </button>
              <button 
                onClick={() => onDelete && onDelete(product)} 
                className="px-3 py-2.5 bg-kob-error hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              >
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
