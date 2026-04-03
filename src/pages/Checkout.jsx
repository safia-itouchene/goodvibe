import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { validateCheckoutForm } from '../utils/validation'
import { WILAYAS } from '../utils/constants'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    wilaya: '',
    address: '',
    notes: '',
  })

  const shipping = cartTotal >= 3000 ? 0 : 500
  const total = cartTotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateCheckoutForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const order = {
      ...form,
      items: cartItems,
      subtotal: cartTotal,
      shipping,
      total,
      date: new Date().toISOString(),
      id: `GV-${Date.now()}`,
    }
    clearCart()
    navigate('/confirmation', { state: { order } })
  }

  if (cartItems.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-white fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              💳 Paiement à la livraison uniquement (Cash on delivery)
            </div>

            <Input
              label="Nom complet"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Votre nom et prénom"
              error={errors.fullName}
            />
            <Input
              label="Numéro de téléphone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="0612345678"
              error={errors.phone}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Wilaya</label>
              <select
                name="wilaya"
                value={form.wilaya}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.wilaya ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Sélectionnez votre wilaya</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="text-red-500 text-xs">{errors.wilaya}</p>}
            </div>
            <Input
              label="Adresse complète"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Numéro, rue, quartier..."
              error={errors.address}
              textarea
            />
            <Input
              label="Notes (optionnel)"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Instructions de livraison, etc."
              textarea
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Confirmer la commande
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-light-gray rounded-2xl p-6 sticky top-24">
              <h3 className="font-playfair text-xl font-bold mb-4">Votre commande</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.itemKey || item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={item.customization?.previewDataUrl || item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      {item.isCustomized && (
                        <span className="absolute -bottom-1 -right-1 rounded-full bg-black text-white text-[9px] px-1.5 py-0.5">
                          Custom
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                      {item.isCustomized && <p className="text-[11px] text-beige font-semibold">Personnalisé</p>}
                    </div>
                    <p className="text-xs font-bold">{(item.price * item.quantity).toLocaleString()} DA</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{cartTotal.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Gratuite</span> : `${shipping} DA`}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{total.toLocaleString()} DA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
