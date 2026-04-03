export default function Input({ label, error, type = 'text', className = '', textarea = false, ...props }) {
  const inputClass = `w-full px-4 py-3 border rounded-xl text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
  } ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea className={`${inputClass} resize-none`} rows={4} {...props} />
      ) : (
        <input type={type} className={inputClass} {...props} />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
