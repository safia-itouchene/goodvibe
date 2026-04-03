import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import Button from '../components/common/Button'

export default function Cart() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const SHIPPING_THRESHOLD = 3000
  const SHIPPING_COST = 500
  const shipping = cartTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = cartTotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="font-playfair text-3xl font-bold mb-3">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Découvrez nos produits et ajoutez-les à votre panier.</p>
        <Button onClick={() => navigate('/shop')} size="lg">Découvrir la boutique</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-3xl font-bold">Mon Panier</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map(item => (
              <CartItem key={item.itemKey || item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-light-gray rounded-2xl p-6 sticky top-24">
              <h3 className="font-playfair text-xl font-bold mb-6">Récapitulatif</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold">{cartTotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      `${SHIPPING_COST.toLocaleString()} DA`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Livraison gratuite à partir de {SHIPPING_THRESHOLD.toLocaleString()} DA
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">{total.toLocaleString()} DA</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={() => navigate('/checkout')}
              >
                Passer la commande
              </Button>
              <Link
                to="/shop"
                className="block text-center text-sm text-gray-500 hover:text-black mt-3 transition-colors"
              >
                Continuer les achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
