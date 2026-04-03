import { useEffect, useRef, useState } from 'react'

const CASE_COLORS = [
  { name: 'Noir', value: '#111111' },
  { name: 'Transparent', value: '#f3f3f3' },
  { name: 'Blanc', value: '#ffffff' },
]

const PRINT_AREA = { x: 26, y: 48, width: 188, height: 300 }

const createRoundedRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const getSignature = (imageData, position, scale, rotation, caseColor) => {
  const imageToken = imageData.slice(0, 64)
  return btoa(
    `${imageToken}|${position.x.toFixed(2)}|${position.y.toFixed(2)}|${scale.toFixed(2)}|${rotation.toFixed(2)}|${caseColor}`
  )
    .replaceAll('=', '')
    .slice(0, 24)
}

export default function CaseCustomizer({
  onChange,
  title = 'Personnalisez votre coque',
  qualityNote = 'Pour de meilleurs résultats, utilisez une image de haute qualité.',
  uploadLabel = 'Upload image (PNG, JPG)',
  zoomLabel = 'Zoom',
  rotationLabel = 'Rotation',
  colorLabel = 'Couleur de coque',
  resetLabel = "Réinitialiser l'image",
  removeLabel = "Supprimer l'image",
  placeholderLabel = 'Téléchargez votre image',
  instructions = '',
  containerClassName = '',
}) {
  const [imageData, setImageData] = useState('')
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [caseColor, setCaseColor] = useState(CASE_COLORS[0].value)
  const [error, setError] = useState('')
  const [previewDataUrl, setPreviewDataUrl] = useState('')
  const canvasRef = useRef(null)
  const dragState = useRef(null)

  const hasImage = Boolean(imageData)

  useEffect(() => {
    if (!hasImage) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#f8f8f8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)'
      ctx.shadowBlur = 18
      ctx.shadowOffsetY = 8
      ctx.fillStyle = caseColor
      createRoundedRectPath(ctx, 12, 12, 216, 372, 34)
      ctx.fill()
      ctx.shadowColor = 'transparent'

      ctx.fillStyle = '#e9e9e9'
      ctx.fillRect(118, 20, 16, 4)

      createRoundedRectPath(ctx, PRINT_AREA.x, PRINT_AREA.y, PRINT_AREA.width, PRINT_AREA.height, 16)
      ctx.save()
      ctx.clip()
      ctx.translate(PRINT_AREA.x + PRINT_AREA.width / 2 + position.x, PRINT_AREA.y + PRINT_AREA.height / 2 + position.y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(scale, scale)

      const baseScale = Math.max(PRINT_AREA.width / img.width, PRINT_AREA.height / img.height)
      const drawWidth = img.width * baseScale
      const drawHeight = img.height * baseScale
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
      ctx.restore()

      setPreviewDataUrl(canvas.toDataURL('image/png', 0.92))
    }
    img.src = imageData

    return () => {
      cancelled = true
    }
  }, [caseColor, hasImage, imageData, position.x, position.y, rotation, scale])

  useEffect(() => {
    if (!onChange) return
    if (!hasImage) {
      onChange(null)
      return
    }
    onChange({
      hasImage: true,
      imageData,
      scale,
      rotation,
      position,
      caseColor,
      printArea: PRINT_AREA,
      previewDataUrl,
      signature: getSignature(imageData, position, scale, rotation, caseColor),
    })
  }, [caseColor, hasImage, imageData, onChange, position, previewDataUrl, rotation, scale])

  const onUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      setError('Format non supporté. Utilisez PNG ou JPG.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image trop lourde (max 8MB).')
      return
    }
    try {
      const data = await readFileAsDataUrl(file)
      setImageData(data)
      setScale(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
      setError('')
    } catch {
      setError("Impossible de charger l'image.")
    }
  }

  const onPointerDown = (event) => {
    if (!hasImage) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    }
  }

  const onPointerMove = (event) => {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return
    const dx = event.clientX - dragState.current.startX
    const dy = event.clientY - dragState.current.startY
    setPosition({
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    })
  }

  const onPointerUp = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return
    dragState.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const resetImage = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const removeImage = () => {
    setImageData('')
    setPreviewDataUrl('')
    setError('')
    resetImage()
  }

  return (
    <section className={`mt-8 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 ${containerClassName}`}>
      <canvas ref={canvasRef} width={240} height={396} className="hidden" />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-playfair text-2xl font-bold text-black">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{qualityNote}</p>
          {instructions && <p className="text-xs text-gray-500 mt-2">{instructions}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">{uploadLabel}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={onUpload}
              className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">{zoomLabel}</label>
            <input
              type="range"
              min="0.6"
              max="2.6"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
              disabled={!hasImage}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">{rotationLabel}</label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full"
              disabled={!hasImage}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{colorLabel}</p>
            <div className="flex flex-wrap gap-2">
              {CASE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setCaseColor(color.value)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                    caseColor === color.value ? 'border-black text-black' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetImage}
              disabled={!hasImage}
              className="px-3 py-2 text-sm rounded-full border border-gray-200 text-gray-700 hover:border-black disabled:opacity-40"
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={removeImage}
              disabled={!hasImage}
              className="px-3 py-2 text-sm rounded-full border border-red-200 text-red-500 hover:border-red-400 disabled:opacity-40"
            >
              {removeLabel}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center bg-light-gray rounded-3xl p-6">
          <div className="relative w-[240px] h-[396px]">
            <div className="absolute inset-0 rounded-[34px] shadow-[0_10px_25px_rgba(0,0,0,0.18)]" style={{ backgroundColor: caseColor }} />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full bg-gray-300" />
            <div
              className="absolute rounded-[16px] overflow-hidden border border-white/30 bg-white/60 select-none touch-none cursor-grab active:cursor-grabbing"
              style={{
                left: `${PRINT_AREA.x}px`,
                top: `${PRINT_AREA.y}px`,
                width: `${PRINT_AREA.width}px`,
                height: `${PRINT_AREA.height}px`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {hasImage ? (
                <img
                  src={imageData}
                  alt="Custom design"
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale}) rotate(${rotation}deg)`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-sm text-gray-500 text-center px-6">
                  {placeholderLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
