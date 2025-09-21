import { useAtomValue, useSetAtom } from 'jotai'
import { worldMapDataAtom, currentSegmentAtom, updateCurrentSegmentAtom } from '@/data/map-atoms'

interface SegmentSelectorProps {
  className?: string
}

export const SegmentSelector = ({ className = '' }: SegmentSelectorProps) => {
  const worldMapData = useAtomValue(worldMapDataAtom)
  const currentSegmentId = useAtomValue(currentSegmentAtom)
  const updateSegment = useSetAtom(updateCurrentSegmentAtom)

  const handleSegmentChange = (segmentId: string) => {
    updateSegment(segmentId)
  }

  // Show loading state while worldmap data is loading
  if (!worldMapData.segments.length) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <label htmlFor="segment-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Map Area
      </label>
      <select
        id="segment-select"
        value={currentSegmentId}
        onChange={(e) => handleSegmentChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-sm"
      >
        {worldMapData.segments.map((segment) => (
          <option key={segment.id} value={segment.id}>
            {segment.name} ({segment.maps.length} maps)
          </option>
        ))}
      </select>
    </div>
  )
}