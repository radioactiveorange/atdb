import { useMemo, useState } from 'preact/hooks'
import { SortFilterModal, SortFilterState, SortOption } from './SortFilterModal'
import { VirtualList } from './VirtualList'

interface Props<T> {
  entities: T[] | undefined
  entityName: string
  sortOptions?: SortOption[]
  renderCard: (entity: T) => any
  renderGrid?: (entities: T[]) => any
  columns?: any // Legacy prop, may be used by renderGrid
  defaultSort?: string
  searchFields?: string[]
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      if (key === 'increaseAttackDamage' && current[key] && typeof current[key] === 'object') {
        return (current[key].min + current[key].max) / 2 // Average damage for sorting
      }
      return current[key]
    }
    return undefined
  }, obj)
}

export function ResponsiveList<T extends { id: string, name?: string }>({ 
  entities, 
  entityName,
  sortOptions = [{ label: 'Name', value: 'name' }],
  renderCard,
  renderGrid,
  columns: _columns, // Renamed to indicate it's intentionally unused
  defaultSort = 'name',
  searchFields = ['name']
}: Props<T>) {
  const [selectedEntity, setSelectedEntity] = useState<T | null>(null)
  const [showSortFilter, setShowSortFilter] = useState(false)
  const [filters, setFilters] = useState<SortFilterState>({
    sortBy: defaultSort,
    sortDirection: 'asc',
    searchTerm: ''
  })

  // Apply filters and sorting
  const filteredAndSortedEntities = useMemo(() => {
    if (!entities) return []

    let filtered = [...entities]

    // Apply search filter
    if (filters.searchTerm?.trim()) {
      const searchLower = filters.searchTerm.toLowerCase().trim()
      filtered = filtered.filter(entity =>
        searchFields.some(field => {
          const value = getNestedValue(entity, field)
          return value && String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = getNestedValue(a, filters.sortBy)
        let bValue = getNestedValue(b, filters.sortBy)

        // Handle undefined values - put them at the end
        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return 1
        if (bValue === undefined) return -1

        // Handle string vs number comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return filters.sortDirection === 'asc' ? comparison : -comparison
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue
          return filters.sortDirection === 'asc' ? comparison : -comparison
        }

        // Convert to string for mixed types
        const comparison = String(aValue || '').localeCompare(String(bValue || ''))
        return filters.sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [entities, filters, searchFields])

  if (!entities) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading {entityName}...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Desktop Grid/Table */}
      {renderGrid && (
        <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-h-0 sm:overflow-hidden">
          {renderGrid(filteredAndSortedEntities)}
        </div>
      )}

      {/* Mobile Card List */}
      <div className={`${renderGrid ? "sm:hidden" : ""} flex flex-col flex-1 min-h-0`}>
        {/* Mobile Header with count and filters */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 dark:text-white text-base">
                {filteredAndSortedEntities.length} {filteredAndSortedEntities.length === 1 ? entityName.slice(0, -1) : entityName}
                {filters.searchTerm && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">
                    of {entities.length}
                  </span>
                )}
              </h2>
            </div>
            <button 
              onClick={() => setShowSortFilter(true)}
              className="flex-shrink-0 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-2 rounded-md border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Sort & Filter
            </button>
          </div>
        </div>

        {/* Entity List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {filteredAndSortedEntities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {filters.searchTerm ? `No ${entityName} match your search` : `No ${entityName} found`}
              </p>
            </div>
          ) : (
            // Removed virtual scrolling to ensure consistent height behavior
            // Regular list for all datasets
            // Regular list for smaller datasets
            <div className="p-4 space-y-3">
              {filteredAndSortedEntities.map((entity, index) => (
                <div key={`${entity.id}-${index}`} onClick={() => setSelectedEntity(entity)}>
                  {renderCard(entity)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Detail Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:hidden">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-end rounded-t-xl">
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              {renderCard(selectedEntity)}
              
              {/* Additional details for items */}
              {(selectedEntity as any).equipEffect && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Equipment Effects</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries((selectedEntity as any).equipEffect).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-gray-900 dark:text-white font-medium">
                              {typeof value === 'object' && value && 'min' in value && 'max' in value 
                                ? `${value.min}-${value.max}` 
                                : Array.isArray(value) ? value.length : value?.toString()}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quest stages for detailed quest view */}
              {(selectedEntity as any).stages && (
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quest Stages ({(selectedEntity as any).stages.length} total)</h4>
                    <div className="space-y-3">
                      {(selectedEntity as any).stages.map((stage: any, index: number) => (
                        <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Progress: {stage.progress}%
                            </span>
                            <div className="flex items-center space-x-2">
                              {stage.rewardExperience && (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                  +{stage.rewardExperience} XP
                                </span>
                              )}
                              {stage.finishesQuest && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-medium">
                                  Complete
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {stage.logText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Where obtained - detailed view for modal */}
              {((selectedEntity as any).droplists?.length > 0 || (selectedEntity as any).conv_links?.length > 0) && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Where to obtain</h4>
                  <div className="space-y-3 text-sm">
                    {/* Monster drops */}
                    {(selectedEntity as any).droplists?.filter((drop: any) => drop.type === 'monster').map((drop: any, index: number) => (
                      <div key={`monster-${index}`} className="flex items-center justify-between">
                        <a 
                          href={`#/monsters#${drop.droplist?.id}`}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline flex items-center gap-2"
                          onClick={(e) => { e.stopPropagation(); window.location.href = `#/monsters#${drop.droplist?.id}` }}
                        >
                          🐉 <span>{drop.droplist?.id || 'Unknown monster'}</span>
                        </a>
                        {drop.chance && drop.chance < 100 && (
                          <span className="text-gray-500 text-xs">{drop.chance}% chance</span>
                        )}
                      </div>
                    ))}
                    
                    {/* Container sources */}
                    {(selectedEntity as any).droplists?.filter((drop: any) => drop.type === 'container').map((drop: any, index: number) => (
                      <div key={`container-${index}`} className="flex items-center justify-between">
                        <span className="text-brown-600 dark:text-brown-400 flex items-center gap-2">
                          📦 <span>{drop.droplist?.id || 'Unknown container'}</span>
                        </span>
                        {drop.chance && drop.chance < 100 && (
                          <span className="text-gray-500 text-xs">{drop.chance}% chance</span>
                        )}
                      </div>
                    ))}
                    
                    {/* NPC conversations */}
                    {(selectedEntity as any).conv_links?.map((conv: string, index: number) => (
                      <div key={`conv-${index}`} className="flex items-center">
                        <a 
                          href={`#/npc#${conv}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-2"
                          onClick={(e) => { e.stopPropagation(); window.location.href = `#/npc#${conv}` }}
                        >
                          💬 <span>{conv}</span>
                        </a>
                      </div>
                    ))}
                    
                    {/* Other drop sources */}
                    {(selectedEntity as any).droplists?.filter((drop: any) => drop.type !== 'monster' && drop.type !== 'container').map((drop: any, index: number) => (
                      <div key={`other-${index}`} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          📋 <span>{drop.droplist?.id || 'Unknown source'} ({drop.type})</span>
                        </span>
                        {drop.chance && drop.chance < 100 && (
                          <span className="text-gray-500 text-xs">{drop.chance}% chance</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional description */}
              {(selectedEntity as any).description && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(selectedEntity as any).description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sort & Filter Modal */}
      <SortFilterModal
        isOpen={showSortFilter}
        onClose={() => setShowSortFilter(false)}
        onApply={setFilters}
        sortOptions={sortOptions}
        currentFilters={filters}
      />
    </div>
  )
}