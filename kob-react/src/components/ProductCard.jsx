import React, { useState } from 'react'
import { useAuth } from '../firebase/auth'

/**
 * ProductCard Component
 * Updated for production with owner-based actions and status indicators.
 */
export default function ProductCard({ product, onEdit, onDelete, onBuyClick }) {
  const { user: authUser } = useAuth()
  const [imageError, setImageError] = useState(false)

  // Security: Check if the current user owns this product
  const canManage = authUser && product.ownerUid === authUser.uid
  
  // Professional SVG placeholder for missing images
  const imagePlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E'
  
  const displayImage = imageError || !product.images?.[0]?.preview ? imagePlaceholder : product.images[0].preview

  function handleImageError() {
    setImageError(true)
  }

  // Dynamic WhatsApp messaging
  const whatsappMessage = encodeURIComponent(
    `Hi, I saw your listing on KOB Marketplace:\n\n*Product:* ${product.title}\n*Price:* ₦${product.price?.toLocaleString() || 'N/A'}\n\nIs this still available?`
  )
  
  const whatsappLink = product.whatsappNumber 
    ? `https://wa.me/${product.whatsappNumber}?text=${whatsappMessage}`
    : `https://wa.me/?text=${whatsappMessage}`

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200 overflow-hidden flex flex-col h-full animate-fade-in">
      
      {/* Image Section */}
      <div className="relative w-full h-52 bg-neutral-100 overflow-hidden">
        <img 
          src={displayImage} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* Status Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isDraft && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Draft
            </span>
          )}
          {!product.isDraft && (
            <span className="bg-green-600 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Live
            </span>
          )}
        </div>

        {product.category && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-kob-dark px-2 py-1 rounded text-xs font-semibold border border-neutral-200 shadow-sm">
            {product.category}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-neutral-800 line-clamp-1 mb-1 capitalize">
          {product.title}
        </h3>
        
        <p className="text-xs text-neutral-500 mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="mb-4">
          <span className="text-xs text-neutral-400 block uppercase font-medium tracking-tighter">Price</span>
          <span className="text-xl font-black text-kob-primary">
            ₦{product.price?.toLocaleString() || '—'}
          </span>
        </div>
        
        {/* Context-Aware Actions */}
        <div className="flex gap-2">
          {canManage ? (
            /* Seller Management Controls */
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => onEdit?.(product)} 
                className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold transition-colors text-xs border border-neutral-300"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete?.(product)} 
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-colors text-xs border border-red-200"
              >
                Delete
              </button>
            </div>
          ) : (
            /* Buyer Experience Controls */
            <div className="flex gap-2 w-full">
              <button
                onClick={() => onBuyClick?.(product)}
                className="flex-1 px-3 py-2 bg-kob-primary hover:bg-kob-primary-dark text-white rounded-lg font-bold transition-all text-xs"
              >
                Interested
              </button>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
