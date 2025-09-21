import { Condition } from '@/data/types'
import { Sprite } from './Sprite'

interface Props {
  condition: Condition
  onClick?: () => void
}

export const ConditionCard = ({ condition, onClick }: Props) => {
  const isPositive = condition.category === 'positive'
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Sprite iconID={condition.iconID} iconBg={condition.iconBg} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {condition.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              isPositive 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {condition.category}
            </span>
          </div>
        </div>
        {condition.links && condition.links.length > 0 && (
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white">
              {condition.links.length}
            </p>
            <p className="text-xs text-gray-500">uses</p>
          </div>
        )}
      </div>

      {/* Ability Effects */}
      {condition.abilityEffect && (
        <div className="grid grid-cols-1 gap-2 text-xs">
          {Object.entries(condition.abilityEffect).map(([key, value]) => (
            value && (
              <div key={key} className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                </span> {value?.toString()}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}