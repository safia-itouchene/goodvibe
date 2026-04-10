import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import logo from '../../assets/logo.png'

export default function Navbar() {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/customize', label: 'Create Your Own Case' },
    { to: '/shop', label: 'Boutique' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ]

  const handleNav = (to) => {
    setMenuOpen(false)
    navigate(to)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className="sticky top-0 z-50 bg-red border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-playfair font-bold tracking-wide text-black">
             <img className='h-10' src={logo} alt="" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNav('/cart')}
              className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-gray-700 hover:text-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-300 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <button
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[84%] max-w-sm bg-white shadow-2xl border-l border-gray-100 transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between">
            <p className="font-playfair text-xl font-bold text-black">Menu</p>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-5 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.to}
                onClick={() => handleNav(link.to)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/cart')}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Voir le panier
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
