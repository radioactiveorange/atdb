import { useEffect, useState } from 'preact/hooks'
import { serverURL } from '../lib'

interface Props {
  iconID: string
  size?: number
}

const getSrc = (file: string) => {
  if (!file) return
  return `${serverURL}/drawable/${file}.png`
}

const getPosition = (index: number, width: number, tileSize: number = 32) => {
  const x = (index % width) * tileSize
  const y = (index * tileSize - x) / width
  return { x, y }
}

export const NPCSprite = ({ iconID, size = 48 }: Props) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [src, setSrc] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!iconID) {
      setImageError(true)
      return
    }

    try {
      const tmp = iconID.split(':')
      const file = tmp[0]
      const index = parseInt(tmp[1] || '0')
      const imageSrc = getSrc(file)
      
      if (!imageSrc) {
        setImageError(true)
        return
      }
      
      // Debug logging
      console.log(`Loading NPC sprite: iconID=${iconID}, file=${file}, index=${index}, src=${imageSrc}`)
      
      const image = new Image()
      image.onload = () => {
        const pos = getPosition(index, image.naturalWidth / 32, 32)
        setPosition(pos)
        setSrc(imageSrc)
        setImageLoaded(true)
        setImageError(false)
      }
      image.onerror = () => {
        console.warn(`Failed to load NPC sprite: ${imageSrc}`)
        setImageError(true)
      }
      image.src = imageSrc
    } catch (error) {
      console.warn(`Error parsing NPC iconID ${iconID}:`, error)
      setImageError(true)
    }
  }, [iconID])

  if (imageError || !iconID) {
    // Fallback to SVG icon
    return (
      <div 
        className="bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg 
          className="text-blue-600 dark:text-blue-300" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          style={{ width: `${size * 0.6}px`, height: `${size * 0.6}px` }}
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  if (!imageLoaded && !imageError) {
    // Loading state
    return (
      <div 
        className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    )
  }

  return (
    <div 
      className="relative rounded-lg overflow-hidden"
      style={{ width: `${size}px`, height: `${size}px` }}
      title={iconID}
    >
      {/* Background/border layer (similar to ItemIcon's iconBg) */}
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          backgroundColor: 'transparent'
        }} 
      />
      {/* Sprite layer */}
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url('${src}')`,
          backgroundPosition: `-${position.x}px -${position.y}px`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto',
          imageRendering: 'pixelated', // For crisp pixel art
        }}
      />
    </div>
  )
}