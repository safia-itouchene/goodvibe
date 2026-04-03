import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCart } from '../context/CartContext'
import Button from '../components/common/Button'
import CaseCustomizer from '../components/product/CaseCustomizer'

const PHONE_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Realme']

export default function CustomizeCase() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [phoneBrand, setPhoneBrand] = useState(PHONE_BRANDS[0])
  const [customization, setCustomization] = useState(null)
  const [added, setAdded] = useState(false)

  const baseProduct = useMemo(
    () => products.find((p) => p.category === 'Phone Cases') || products[0],
    []
  )

  const handleAddToCart = () => {
    if (!baseProduct || !customization?.hasImage) return
    addToCart({
      ...baseProduct,
      isCustomized: true,
      customization: {
        ...customization,
        phoneBrand,
      },
      itemKey: `${baseProduct.id}-${phoneBrand}-${customization.signature}`,
      name: `${baseProduct.name} - ${phoneBrand}`,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="min-h-screen bg-white fade-in">

      {/* Simple elegant header */}
      <section className="max-w-7xl mx-auto px-4 pt-14 pb-10 text-center">
        <p className="uppercase tracking-[0.25em] text-gray-400 text-xs mb-4">Studio</p>
        <h2 className="font-playfair text-4xl md:text-5xl font-bold text-black mb-4">
          Design Your Custom Case
        </h2>
      </section>

      <section id="designer" className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CaseCustomizer
              title="Customize Your Phone Case"
              qualityNote="For best results, use high-quality images."
              uploadLabel="Upload image (PNG, JPG)"
              zoomLabel="Zoom"
              rotationLabel="Rotate"
              colorLabel="Case color"
              resetLabel="Reset image"
              removeLabel="Remove image"
              placeholderLabel="Upload your image here"
              instructions="Drag, zoom, and position your image to fit the case perfectly."
              onChange={setCustomization}
              containerClassName="mt-0"
            />
          </div>

          <aside className="rounded-3xl border border-gray-200 p-6 h-fit sticky top-24">
            <h2 className="font-playfair text-2xl font-bold mb-4">Your Design</h2>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">Phone brand</span>
              <select
                value={phoneBrand}
                onChange={(e) => setPhoneBrand(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                {PHONE_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </label>

            <div className="rounded-2xl bg-light-gray p-4 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">Tip:</span> Keep your subject centered for the cleanest print.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!customization?.hasImage}
            >
              {added ? '✓ Added to cart' : 'Add to Cart'}
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              Your design (brand + image + transforms + color) will be saved with your cart item.
            </p>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link to="/cart" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600">
                Go to cart
              </Link>
              <button
                onClick={() => navigate('/shop')}
                className="block text-sm mt-2 text-gray-500 hover:text-black transition-colors"
              >
                Continue shopping
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}