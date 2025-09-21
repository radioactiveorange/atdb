import { Link } from 'react-router-dom'
import { TileRenderer } from './TileRenderer'

interface LocalMapViewerProps {
  mapId: string
  className?: string
}

export const LocalMapViewer = ({ mapId, className = '' }: LocalMapViewerProps) => {
  // Check if this is an interior map that should have a back button
  const isInteriorMap = mapId.includes('_interior') ||
                       mapId.includes('_house') ||
                       mapId.includes('_inn') ||
                       mapId.includes('_shop') ||
                       mapId.includes('_cave') ||
                       mapId.includes('_basement')

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <Link
          to="/map"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          ← World Map
        </Link>

        {isInteriorMap && (
          <button
            onClick={() => window.history.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
          >
            ← Back Outside
          </button>
        )}
      </div>

      {/* Tile Renderer */}
      <TileRenderer mapId={mapId} className="w-full h-full" />
    </div>
  )
}