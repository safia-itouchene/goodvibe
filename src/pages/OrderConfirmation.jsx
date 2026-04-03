import { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  useEffect(() => {
    if (!order) navigate('/')
  }, [order, navigate])

  if (!order) return null

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 fade-in">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-playfair text-4xl font-bold text-black mb-3">Commande confirmée !</h1>
        <p className="text-gray-500 mb-2">Merci pour votre commande, {order.fullName} !</p>
        <p className="text-sm text-gray-400 mb-8">Commande N° <strong className="text-black">{order.id}</strong></p>

        <div className="bg-light-gray rounded-2xl p-6 text-left mb-8">
          <h3 className="font-semibold text-black mb-4">Récapitulatif</h3>
            <div className="space-y-2 mb-4">
              {order.items.map(item => (
                <div key={item.itemKey || item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} × {item.quantity}
                    {item.isCustomized && <span className="ml-1 text-beige font-semibold">(Custom)</span>}
                  </span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} DA</span>
                </div>
              ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span>{order.shipping === 0 ? 'Gratuite' : `${order.shipping} DA`}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{order.total.toLocaleString()} DA</span>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 text-sm text-gray-600 space-y-1">
            <p><strong>Livraison à :</strong> {order.address}, {order.wilaya}</p>
            <p><strong>Téléphone :</strong> {order.phone}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Notre équipe vous contactera dans les 24-48h pour confirmer votre commande.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  )
}
