export default function About() {
  return (
    <div className="min-h-screen bg-white fade-in">
      {/* Hero */}
      <section className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
          alt="About"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-playfair text-5xl font-bold">À propos de nous</h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-3xl font-bold mb-6">Notre histoire</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GoodVibe est née d&apos;une passion pour l&apos;élégance et le design. Fondée en 2022 à Alger,
              notre marque propose des accessoires tech de haute qualité qui allient protection et style.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chaque produit est soigneusement sélectionné pour sa qualité, son design et sa durabilité.
              Nous croyons que vos gadgets méritent d&apos;être protégés avec style.
            </p>
          </div>
          <div className="aspect-square rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
              alt="Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-light-gray py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl font-bold mb-6">Notre mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            &quot;Offrir à chaque Algérien des accessoires de qualité premium qui reflètent leur personnalité
            unique tout en protégeant ce qui compte pour eux.&quot;
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-playfair text-3xl font-bold text-center mb-12">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '✨', title: 'Qualité', desc: 'Nous ne faisons aucun compromis sur la qualité de nos produits.' },
            { icon: '🎨', title: 'Design', desc: 'Des designs élaborés par des artistes passionnés.' },
            { icon: '🤝', title: 'Confiance', desc: 'La satisfaction de nos clients est notre priorité absolue.' },
          ].map((v, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">{v.icon}</span>
              <h3 className="font-playfair text-xl font-bold mb-3">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
