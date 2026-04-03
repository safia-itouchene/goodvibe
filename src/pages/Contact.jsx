import { useState } from 'react'
import { validateContactForm } from '../utils/validation'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateContactForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white fade-in">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-gray-500">Nous sommes là pour vous aider. N&apos;hésitez pas à nous écrire.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-6">Informations de contact</h2>
              <div className="space-y-4">
                {[
                  { icon: '📧', label: 'Email', value: 'contact@goodvibe.dz' },
                  { icon: '📞', label: 'Téléphone', value: '+213 555 123 456' },
                  { icon: '📍', label: 'Adresse', value: 'Alger, Algérie' },
                ].map((info, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-700">{info.label}</p>
                      <p className="text-gray-500 text-sm">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                {['Instagram', 'Facebook', 'TikTok'].map(s => (
                  <a
                    key={s}
                    href="#"
                    className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-200"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-light-gray">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-light-gray rounded-3xl p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-gray-500">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-playfair text-2xl font-bold mb-2">Envoyez-nous un message</h3>
                <Input
                  label="Votre nom"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.name}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  error={errors.email}
                />
                <Input
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  error={errors.message}
                  textarea
                />
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  Envoyer le message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
