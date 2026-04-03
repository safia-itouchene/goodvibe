export default function Loading({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200"></div>
        <div className="w-10 h-10 rounded-full border-2 border-black border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-sm text-gray-500 font-medium">Chargement...</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  )
}
