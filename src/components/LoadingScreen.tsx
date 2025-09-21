import { status } from '@/lib/database'
import { useEffect, useState } from 'preact/hooks'

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [maxProgress, setMaxProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(status.progress)
      setMaxProgress(status.maxProgress)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const percentage = maxProgress > 0 ? ((maxProgress - progress) / maxProgress) * 100 : 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Andor's Trail Database
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Loading game data...
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {maxProgress > 0 ? (
              `${Math.round(percentage)}% complete`
            ) : (
              'Initializing...'
            )}
          </p>
        </div>

        {/* Loading items counter */}
        {maxProgress > 0 && progress > 0 && (
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Loading {maxProgress - progress} of {maxProgress} resources
          </div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}