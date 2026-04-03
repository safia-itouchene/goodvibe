import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

function StarRating({ rating }) {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    onQuickView && onQuickView(product)
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm  cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square bg-light-gray">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />

        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2 py-1 rounded-full">
            Best Seller
          </span>
        )}

        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button
            onClick={handleAddToCart}
            aria-label={added ? 'Ajouté au panier' : 'Ajouter au panier'}
            className={`h-9 w-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {added ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.2 3.5A1 1 0 006.8 18h10.4M9 21a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleQuickView}
            className="flex-1 bg-white text-black text-xs font-semibold px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
          >
            Vue rapide
          </button>
        </div>
      </div>

      <div className="p-4">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-black mt-1 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center space-x-1 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className="font-bold text-black">{product.price.toLocaleString()} DA</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} DA</span>
          )}
        </div>
      </div>
    </div>
  )
}
