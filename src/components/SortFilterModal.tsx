import { useState } from 'preact/hooks'

export interface SortOption {
  label: string
  value: string
}

export interface SortFilterState {
  sortBy: string
  sortDirection: 'asc' | 'desc'
  searchTerm: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: SortFilterState) => void
  sortOptions: SortOption[]
  currentFilters: SortFilterState
}

export const SortFilterModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  sortOptions, 
  currentFilters 
}: Props) => {
  const [filters, setFilters] = useState<SortFilterState>(currentFilters)

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      sortBy: 'name',
      sortDirection: 'asc' as const,
      searchTerm: ''
    }
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between rounded-t-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Sort & Filter
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: (e.target as HTMLInputElement).value })}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: (e.target as HTMLSelectElement).value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortDirection"
                  value="asc"
                  checked={filters.sortDirection === 'asc'}
                  onChange={() => setFilters({ ...filters, sortDirection: 'asc' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Ascending</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sortDirection"
                  value="desc"
                  checked={filters.sortDirection === 'desc'}
                  onChange={() => setFilters({ ...filters, sortDirection: 'desc' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Descending</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 flex space-x-3 rounded-b-lg">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}