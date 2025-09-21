import { useEffect } from 'preact/hooks'
import { Suspense } from 'preact/compat'
import { useSetAtom } from 'jotai'
import { useLocation } from 'react-router-dom'
import { GlobalMapViewer, LocalMapViewer } from '@/components'
import { mapDataAtom } from '@/data/map-atoms'
import { loadMapData } from '@/lib/map-data'

export const Map = () => {
  const setMapData = useSetAtom(mapDataAtom)
  const location = useLocation()

  // Extract mapId from path like /map/blackwater_mountain0
  const pathSegments = location.pathname.split('/')
  const mapId = pathSegments[pathSegments.length - 1] || null
  const isGlobalMap = !mapId || mapId === 'map'

  useEffect(() => {
    const loadMaps = async () => {
      try {
        const maps = await loadMapData()
        setMapData(maps)
      } catch (error) {
        console.error('Failed to load map data:', error)
      }
    }

    loadMaps()
  }, [setMapData])

  return (
    <div className="flex flex-col h-full">
      {/* Map Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isGlobalMap ? 'World Map' : `Map: ${mapId}`}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isGlobalMap ? 'Explore the world of Andor\'s Trail' : 'Local map view'}
            </p>
          </div>
          {isGlobalMap && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Use mouse wheel or pinch to zoom • Drag to pan
            </div>
          )}
        </div>
      </div>

      {/* Map Viewer */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>{isGlobalMap ? 'Loading world map...' : 'Loading local map...'}</p>
            </div>
          </div>
        }>
          {isGlobalMap ? (
            <GlobalMapViewer />
          ) : (
            <LocalMapViewer mapId={mapId!} />
          )}
        </Suspense>
      </div>
    </div>
  )
}
