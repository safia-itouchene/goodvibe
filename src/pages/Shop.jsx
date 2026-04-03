import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import products from '../data/products.json'
import ProductGrid from '../components/product/ProductGrid'
import ProductModal from '../components/product/ProductModal'
import { CATEGORIES, SORT_OPTIONS } from '../utils/constants'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState(8000)

  const categoryParam = searchParams.get('category') || 'All'
  const sortParam = searchParams.get('sort') || 'default'

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [categoryParam, sortParam, search, priceRange])

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat === 'All') params.delete('category')
    else params.set('category', cat)
    setSearchParams(params)
  }

  const setSort = (sort) => {
    const params = new URLSearchParams(searchParams)
    if (sort === 'default') params.delete('sort')
    else params.set('sort', sort)
    setSearchParams(params)
  }

  let filtered = products.filter(p => {
    const matchCat = categoryParam === 'All' || p.category === categoryParam
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchPrice = p.price <= priceRange
    return matchCat && matchSearch && matchPrice
  })

  if (sortParam === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sortParam === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sortParam === 'popular') filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)
  else if (sortParam === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-white fade-in">
      <div className="bg-light-gray py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-playfair text-4xl font-bold text-center">Boutique</h1>
          <p className="text-center text-gray-500 mt-2">{filtered.length} produits</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={sortParam}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                categoryParam === cat
                  ? 'bg-black text-white'
                  : 'bg-light-gray text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'Tous' : cat}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-gray-600 whitespace-nowrap">Prix max :</span>
          <input
            type="range"
            min={1500}
            max={8000}
            step={100}
            value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
            className="w-40 accent-black"
          />
          <span className="text-sm font-semibold text-black whitespace-nowrap">{priceRange.toLocaleString()} DA</span>
        </div>

        <ProductGrid products={filtered} loading={loading} onQuickView={setQuickViewProduct} />
      </div>

      {quickViewProduct && (
        <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
