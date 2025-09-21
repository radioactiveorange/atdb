import { Item } from '@/data'
import { ItemIcon } from './ItemIcon'
import { Link } from 'react-router-dom'

interface Props {
  item: Item
  onClick?: () => void
}

export const MobileItemCard = ({ item, onClick }: Props) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        <ItemIcon item={item} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.categoryLink.name}
          </p>
        </div>
        {item.baseMarketCost && (
          <div className="text-right">
            <p className="font-medium text-gray-900 dark:text-white">
              {item.baseMarketCost}
            </p>
            <p className="text-xs text-gray-500">gold</p>
          </div>
        )}
      </div>

      {/* Quick Stats - Only show if relevant */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {item.equipEffect?.increaseAttackDamage && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
            <span className="font-medium">Damage:</span> {item.equipEffect.increaseAttackDamage.min}-{item.equipEffect.increaseAttackDamage.max}
          </div>
        )}
        {item.equipEffect?.increaseMaxHP && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            <span className="font-medium">HP:</span> +{item.equipEffect.increaseMaxHP}
          </div>
        )}
        {item.equipEffect?.increaseMaxAP && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            <span className="font-medium">AP:</span> +{item.equipEffect.increaseMaxAP}
          </div>
        )}
        {item.equipEffect?.increaseAttackChance && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
            <span className="font-medium">Hit:</span> +{item.equipEffect.increaseAttackChance}%
          </div>
        )}
        {item.equipEffect?.increaseBlockChance && (
          <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
            <span className="font-medium">Block:</span> +{item.equipEffect.increaseBlockChance}%
          </div>
        )}
        {item.conditionsCount > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
            <span className="font-medium">Conditions:</span> {item.conditionsCount}
          </div>
        )}
      </div>

      {/* Where obtained section */}
      {(item.droplists?.length > 0 || item.conv_links?.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Where obtained:</h4>
          <div className="space-y-1">
            {/* Monster/Container drops */}
            {item.droplists?.slice(0, 3).map((drop: any, index: number) => (
              <div key={index} className="text-xs">
                {drop.type === 'monster' && drop.droplist?.id ? (
                  <Link 
                    to={`/monsters#${drop.droplist.id}`}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🐉 {drop.droplist.id}
                  </Link>
                ) : drop.type === 'container' && drop.droplist?.id ? (
                  <span className="text-brown-600 dark:text-brown-400">
                    📦 {drop.droplist.id}
                  </span>
                ) : drop.droplist?.id ? (
                  <span className="text-gray-600 dark:text-gray-400">
                    📋 {drop.droplist.id}
                  </span>
                ) : null}
                {drop.chance && drop.chance < 100 && (
                  <span className="text-gray-500 ml-1">({drop.chance}%)</span>
                )}
              </div>
            ))}
            
            {/* NPC/Conversation links */}
            {item.conv_links?.slice(0, 3).map((conv: string, index: number) => (
              <div key={index} className="text-xs">
                <Link 
                  to={`/npc#${conv}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  💬 {conv}
                </Link>
              </div>
            ))}
            
            {/* Show "and X more" if there are too many sources */}
            {(item.droplists?.length || 0) + (item.conv_links?.length || 0) > 3 && (
              <div className="text-xs text-gray-500 italic">
                ...and {((item.droplists?.length || 0) + (item.conv_links?.length || 0)) - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rarity indicator */}
      {item.displaytype !== 'ordinary' && (
        <div className="mt-2 flex justify-end">
          <span className={`text-xs px-2 py-1 rounded-full font-medium
            ${item.displaytype === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : ''}
            ${item.displaytype === 'extraordinary' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' : ''}
            ${item.displaytype === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : ''}
            ${item.displaytype === 'quest' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : ''}
          `}>
            {item.displaytype}
          </span>
        </div>
      )}
    </div>
  )
}