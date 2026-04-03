import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import products from '../data/products.json'
import { useCart } from '../context/CartContext'
import ProductGrid from '../components/product/ProductGrid'
import Button from '../components/common/Button'
import CaseCustomizer from '../components/product/CaseCustomizer'

function StarRating({ rating }) {
  return (
    <div className="flex space-x-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [customization, setCustomization] = useState(null)

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-playfair text-3xl font-bold mb-4">Produit introuvable</h2>
        <p className="text-gray-500 mb-6">Ce produit n&apos;existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/shop')}>Retour à la boutique</Button>
      </div>
    )
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  const handleAddToCart = () => {
    const customizedProduct = customization?.hasImage
      ? {
          ...product,
          isCustomized: true,
          customization,
          itemKey: `${product.id}-${customization.signature}`,
        }
      : {
          ...product,
          itemKey: `${product.id}-default`,
        }
    for (let i = 0; i < quantity; i++) addToCart(customizedProduct)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white fade-in">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black transition-colors">Boutique</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-black font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-light-gray">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {product.isBestSeller && (
              <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
                Best Seller
              </span>
            )}
            <span className="text-sm text-gray-400 uppercase tracking-wider">{product.category}</span>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-black mt-2 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-3 mb-6">
              <StarRating rating={product.rating} />
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} avis)</span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-black">{product.price.toLocaleString()} DA</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">{product.originalPrice.toLocaleString()} DA</span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded-full">-{discount}%</span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantité :</span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" className="flex-1" onClick={handleAddToCart}>
                {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => { handleAddToCart(); navigate('/cart') }}>
                Acheter maintenant
              </Button>
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-light-gray rounded-2xl text-sm text-gray-600 space-y-2">
              <p>🚚 Livraison disponible dans toute l&apos;Algérie</p>
              <p>💳 Paiement à la livraison (Cash on delivery)</p>
              <p>🔄 Retours acceptés sous 7 jours</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-playfair text-2xl font-bold mb-8">Produits similaires</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </div>
  )
}
