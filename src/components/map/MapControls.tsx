interface MapControlsProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  showOverlays: boolean
  onToggleOverlays: () => void
  className?: string
}

export const MapControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  showOverlays,
  onToggleOverlays,
  className = '',
}: MapControlsProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Zoom Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-col gap-1">
          <button
            onClick={onZoomIn}
            disabled={zoom >= 20}
            className="w-10 h-10 flex items-center justify-center rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold transition-colors"
            title="Zoom In"
          >
            +
          </button>
          
          <div className="text-xs text-center text-gray-600 dark:text-gray-400 px-1 py-1">
            {zoom.toFixed(1)}x
          </div>
          
          <button
            onClick={onZoomOut}
            disabled={zoom <= 1}
            className="w-10 h-10 flex items-center justify-center rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold transition-colors"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* View Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            title="Reset View"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            onClick={onToggleOverlays}
            className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
              showOverlays 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
            }`}
            title={`${showOverlays ? 'Hide' : 'Show'} Overlays`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Instructions for mobile */}
      <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center space-y-1">
          <div>Pinch to zoom</div>
          <div>Drag to pan</div>
        </div>
      </div>
    </div>
  )
}