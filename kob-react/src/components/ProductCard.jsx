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
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img 
          src={displayImage} 
          alt={product.title} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-kob-dark line-clamp-2">{product.title}</h3>
        
        <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-3 flex-grow">{product.description}</p>
        
        {/* Price */}
        <div className="text-xl font-bold text-kob-primary mb-3">₦{product.price || '—'}</div>
        
        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {/* Buy Now Button */}
          {authUser && authUser.role === 'buyer' && (
            <button
              onClick={() => onBuyClick?.(product)}
              className="flex-1 px-3 py-2 bg-kob-primary hover:bg-opacity-90 text-white rounded-md font-medium transition-colors text-center text-sm"
            >
              🛒 Buy Now
            </button>
          )}

          {/* WhatsApp Contact Button */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors text-center text-sm"
          >
            📱 Contact
          </a>
          
          {/* Edit/Delete for Admins */}
          {canEdit && (
            <>
              <button 
                onClick={() => onEdit && onEdit(product)} 
                className="px-3 py-2 bg-kob-primary hover:bg-opacity-80 text-white rounded-md font-medium transition-all text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete && onDelete(product)} 
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
