import React from 'react'

export default function ProductCard({ product, user, onEdit, onDelete }) {
  const canEdit = user && user.role === 'admin'

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {product.imageURL && (
        <img src={product.imageURL} alt={product.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-kob-dark">{product.title}</h3>
        <p className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold text-kob-primary">₦{product.price || '—'}</div>
          <div className="flex gap-2">
            {canEdit && (
              <button onClick={() => onEdit && onEdit(product)} className="px-3 py-1 bg-kob-primary text-white rounded">Edit</button>
            )}
            {canEdit && (
              <button onClick={() => onDelete && onDelete(product)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
