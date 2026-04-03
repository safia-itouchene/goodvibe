import { Link } from 'react-router-dom'
import logo from '../../assets/logo-white.png'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="font-playfair font-bold tracking-wide text-black">
              <img className='h-11' src={logo} alt="" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Exprimez votre style avec nos coques et accessoires élégants. Qualité premium, design unique.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Navigation</h4>
            <ul className="space-y-2">
              {[['/', 'Accueil'], ['/shop', 'Boutique'], ['/about', 'À propos'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contact@goodvibe.dz</li>
              <li>+213 555 123 456</li>
              <li>Alger, Algérie</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">TikTok</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} GoodVibe. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
