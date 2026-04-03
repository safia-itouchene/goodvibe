import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Button from '../common/Button'

export default function ProductModal({ product, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-black transition-colors"
        >
          ✕
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-square rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden bg-light-gray">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</span>
              <h2 className="font-playfair text-xl font-bold mt-1 text-black">{product.name}</h2>
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{product.description}</p>
              <div className="flex items-center space-x-3 mt-4">
                <span className="text-2xl font-bold text-black">{product.price.toLocaleString()} DA</span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">{product.originalPrice.toLocaleString()} DA</span>
                )}
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => { addToCart(product); onClose() }}
              >
                Ajouter au panier
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => { navigate(`/product/${product.id}`); onClose() }}
              >
                Voir les détails
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
