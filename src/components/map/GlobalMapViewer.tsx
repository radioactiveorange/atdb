import { useAtomValue } from 'jotai'
import { Link } from 'react-router-dom'
import { Suspense } from 'preact/compat'
import {
  visibleMapsAtom,
  worldMapDataAtom
} from '@/data/map-atoms'

interface GlobalMapViewerProps {
  className?: string
}

const GlobalMapViewerContent = ({ className = '' }: GlobalMapViewerProps) => {
  const visibleMaps = useAtomValue(visibleMapsAtom)
  const worldMapData = useAtomValue(worldMapDataAtom)

  // Use world1 segment like the original site
  const segment = worldMapData.segmentsMap['world1']
  if (!segment) {
    return (
      <div className={`${className} flex items-center justify-center h-full text-white`}>
        Loading world1 segment...
      </div>
    )
  }

  // Calculate zoom like the original: maps.length > 100 ? 2 : maps.length > 18 ? 6 : maps.length > 3 ? 8 : 10
  const zoom = segment.maps.length > 100 ? 2 : segment.maps.length > 18 ? 6 : segment.maps.length > 3 ? 8 : 10

  console.log(`World1 segment has ${segment.maps.length} maps, using zoom: ${zoom}`)

  // Calculate container height from actual positioned maps
  const containerHeight = Math.max(...segment.maps.map(m => {
    const mapData = visibleMaps.find(vm => vm.id === m.id)
    return mapData ? m.y * zoom + mapData.height * 32 : 0
  }), 1000)

  return (
    <div className={`relative w-full h-full overflow-auto bg-gray-900 ${className}`}>
      {/* Exact structure from original: GlobalMap container with fixed height */}
      <div
        className="relative"
        style={{ height: `${containerHeight}px` }}
      >
        {/* Render maps using the original formula: left: (row.x - data.x) * zoom */}
        {segment.maps.map(worldMapEntry => {
          // Find the corresponding map data for dimensions
          const mapData = visibleMaps.find(m => m.id === worldMapEntry.id)
          if (!mapData) {
            console.log(`No map data found for worldmap entry: ${worldMapEntry.id}`)
            return null
          }

          // Use segment-relative coordinates scaled by zoom (original formula)
          const left = (worldMapEntry.x - segment.x) * zoom
          const top = (worldMapEntry.y - segment.y) * zoom
          // Use original scaling: 2 pixels per tile (from map.html reference)
          const width = mapData.width * 2
          const height = mapData.height * 2

          return (
            <Link
              key={worldMapEntry.id}
              to={`/map/${worldMapEntry.id}`}
              className="absolute cursor-pointer hover:brightness-110 transition-all duration-200"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
              }}
              title={worldMapEntry.id}
            >
              <img
                src={`/atdb/backgrounds/${worldMapEntry.id}.jpg`}
                alt={worldMapEntry.id}
                style={{
                  imageRendering: 'pixelated',
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.backgroundColor = '#374151'
                  target.style.border = '1px solid #666'
                }}
              />
            </Link>
          )
        }).filter(Boolean)}

        {/* Debug info */}
        {visibleMaps.length === 0 && (
          <div className="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded">
            No maps loaded
          </div>
        )}
      </div>
    </div>
  )
}

export const GlobalMapViewer = ({ className = '' }: GlobalMapViewerProps) => {
  return (
    <Suspense fallback={
      <div className={`${className} flex items-center justify-center h-full text-white`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading world map...</p>
        </div>
      </div>
    }>
      <GlobalMapViewerContent className={className} />
    </Suspense>
  )
}