import { useState } from 'preact/hooks'

export const VersionInfo = () => {
  const [showTooltip, setShowTooltip] = useState(false)
  const version = import.meta.env.VITE_AT_VERSION || 'unknown'

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        aria-label={`Data from Andor's Trail version ${version}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>

      {showTooltip && (
        <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
          <div className="text-center">
            <div className="font-medium">ATDB</div>
            <div>Data from Andor's Trail v{version}</div>
          </div>
          {/* Arrow pointing right */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 dark:border-l-gray-700"></div>
        </div>
      )}
    </div>
  )
}