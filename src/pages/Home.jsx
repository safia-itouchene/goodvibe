import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductGrid from '../components/product/ProductGrid'
import ProductModal from '../components/product/ProductModal'
import Button from '../components/common/Button'
import banner from '../assets/banner.png'
import bannerphone from '../assets/banner-phone.png'
const CATEGORIES_PREVIEW = [
  { name: 'Phone Cases', label: 'Coques Téléphone', image: 'https://i.pinimg.com/736x/f4/b2/ce/f4b2cecffd923677053fca30bf4bfb8f.jpg' },
  { name: 'Laptop Cases', label: 'Coques Laptop', image: 'https://i.pinimg.com/736x/bd/cb/3f/bdcb3f5319dba043639aa269c476a20c.jpg' },
  { name: 'Airpods Cases', label: 'Coques AirPods', image: 'https://i.pinimg.com/736x/39/e3/05/39e3056b6a75c9a4c906e3405a007363.jpg' },
  { name: 'Accessories', label: 'Accessoires', image: 'https://i.pinimg.com/736x/7b/5f/52/7b5f5225b21a83ddb13d6c439b09e92b.jpg' },
]

const TESTIMONIALS = [
  { name: 'Amira B.', text: 'Qualité exceptionnelle ! Ma coque a tenu 6 mois sans la moindre égratignure. Je recommande vivement.', rating: 5 },
  { name: 'Karim M.', text: 'Livraison rapide et produit conforme à la description. Le design est élégant et raffiné.', rating: 5 },
  { name: 'Lynda S.', text: 'Parfait pour protéger mes AirPods. La broderie est vraiment magnifique et détaillée.', rating: 4 },
  { name: 'Rami T.', text: 'Excellent rapport qualité-prix. La coque en cuir est vraiment premium.', rating: 5 },
]

function StarRating({ rating }) {
  return (
    <div className="flex space-x-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const featured = products.filter(p => p.isFeatured).slice(0, 8)
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
       <div className="absolute inset-0">
          {/* Desktop banner */}
          <img
          src={banner}
          alt="Hero"
          className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile banner */}
          <img
          src={bannerphone}
          alt="Hero"
          className="block md:hidden w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold leading-tight mb-6">
            Exprimez votre style
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-light">
            Découvrez notre collection de coques et accessoires élégants
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            
            <Button
              variant="outline"
              size="lg"
              className="bg-white/90 border-white text-black hover:bg-white"
              onClick={() => navigate('/shop')}
            >
              Découvrir la collection
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-gray-200 bg-light-gray p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">New</p>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold">Create Your Own Case</h2>
            <p className="text-sm text-gray-600 mt-2">Upload, drag, zoom, and build a unique custom case in minutes.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/customize')}>
            Start Designing
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5 px-4 max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-12">Nos Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES_PREVIEW.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-semibold text-sm md:text-base">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold">Nos Coups de Cœur</h2>
            <Link to="/shop" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors">
              Voir tout
            </Link>
          </div>
          <ProductGrid products={featured} onQuickView={setQuickViewProduct} />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-5 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold">Meilleures Ventes</h2>
          <Link to="/shop" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors">
            Voir tout
          </Link>
        </div>
        <ProductGrid products={bestSellers} onQuickView={setQuickViewProduct} />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-12">Ce que disent nos clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <StarRating rating={t.rating} />
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">&quot;{t.text}&quot;</p>
                <p className="font-semibold text-black text-sm mt-4">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
     {/* Newsletter */}
{/* Newsletter */}
<section
  className="py-20"
  style={{
    backgroundImage: 'repeating-linear-gradient(90deg, #F5D86A 0px, #F5D86A 90px, #fffce4 90px, #fffce4 170px)',
  }}
>
  <div className="max-w-2xl mx-auto px-4 text-center">
    <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0749a9' }}>
      Rejoignez notre communauté
    </h2>
    <p className="mb-8" style={{ color: '#0749a9' }}>
      Inscrivez-vous pour recevoir nos offres exclusives et nouveautés en avant-première.
    </p>
    {subscribed ? (
      <p className="font-semibold px-6 py-3 rounded-full inline-block border" style={{ color: '#0749a9', borderColor: '#0749a9', backgroundColor: 'rgba(7,73,169,0.07)' }}>
        ✓ Merci ! Vous êtes inscrit(e).
      </p>
    ) : (
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="flex-1 px-5 py-3 rounded-full focus:outline-none focus:ring-2 text-sm"
          style={{
            border: '1.5px solid #0749a9',
            backgroundColor: 'rgba(255,253,240,0.85)',
            color: '#0749a9',
            '--tw-ring-color': '#0749a9',
          }}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full font-medium text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#0749a9', color: '#fff' }}
        >
          S&apos;inscrire
        </button>
      </form>
    )}
  </div>
</section>

      {quickViewProduct && (
        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
