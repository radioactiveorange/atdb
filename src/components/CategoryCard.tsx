interface Category {
  id: string
  name: string
  inventorySlot?: string
  actionType?: string
  size?: string
  [key: string]: any
}

interface Props {
  category: Category
  onClick?: () => void
}

export const CategoryCard = ({ category, onClick }: Props) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {category.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            {category.inventorySlot && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                {category.inventorySlot}
              </span>
            )}
            {category.actionType && (
              <span className="text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">
                {category.actionType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}