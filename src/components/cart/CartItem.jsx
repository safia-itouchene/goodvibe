import { useCart } from '../../context/CartContext'

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-100">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-light-gray flex-shrink-0 relative">
        <img
          src={item.customization?.previewDataUrl || item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.isCustomized && (
          <span className="absolute bottom-1 left-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] text-white">
            Custom
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-black truncate">{item.name}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
        {item.isCustomized && <p className="text-xs text-beige mt-0.5 font-semibold">Produit personnalisé</p>}
        <p className="text-sm font-bold text-black mt-1">{item.price.toLocaleString()} DA</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.itemKey, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors text-sm"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.itemKey, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-black hover:text-black transition-colors text-sm"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-black">{(item.price * item.quantity).toLocaleString()} DA</p>
        <button
          onClick={() => removeFromCart(item.itemKey)}
          aria-label="Supprimer du panier"
          className="mt-1 w-8 h-8 rounded-full border border-red-100 text-red-400 hover:text-red-600 hover:border-red-300 transition-colors inline-flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.87 12.14A2 2 0 0116.14 21H7.86a2 2 0 01-1.99-1.86L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
