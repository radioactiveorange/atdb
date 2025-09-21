import { memo } from 'preact/compat'
import { MapData, calculateTilePosition, getMapImageUrl } from '@/lib/map-utils'

interface MapTileProps {
  map: MapData
  zoom: number
  onClick?: (mapId: string) => void
  isSelected?: boolean
}

export const MapTile = memo(({ map, zoom, onClick, isSelected }: MapTileProps) => {
  // Position maps absolutely like the original implementation
  const position = {
    left: map.x,
    top: map.y,
    width: map.width * 32,
    height: map.height * 32,
  }
  const imageUrl = getMapImageUrl(map.id)

  // Debug: Log first few tiles
  if (map.id === 'aidem_base_1' || map.id === 'aidem_base_2') {
    console.log(`Rendering ${map.id} at position:`, position, 'zoom:', zoom)
  }

  const handleClick = () => {
    onClick?.(map.id)
  }

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 hover:brightness-110 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-75' : ''
      }`}
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
        transform: 'translateZ(0)', // Hardware acceleration
      }}
      onClick={handleClick}
      title={map.name || map.id}
    >
      <img
        src={imageUrl}
        alt={map.name || map.id}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
        style={{
          imageRendering: 'pixelated', // Maintain pixel art quality
        }}
        onError={(e) => {
          // Fallback for missing images
          const target = e.target as HTMLImageElement
          target.style.backgroundColor = '#374151'
          target.style.display = 'flex'
          target.style.alignItems = 'center'
          target.style.justifyContent = 'center'
          target.alt = map.id
        }}
      />
      
      {/* Map name overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <span className="text-white text-xs font-semibold opacity-0 hover:opacity-100 transition-opacity duration-200 text-center px-1">
          {map.name || map.id}
        </span>
      </div>
    </div>
  )
})

MapTile.displayName = 'MapTile'