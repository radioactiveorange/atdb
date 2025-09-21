import { Sprite, ItemIcon } from './index'
import { NPC } from '@/data'

interface Props {
  npc: NPC
  onClick?: () => void
}

export const NPCCard = ({ npc, onClick }: Props) => {
  const displayName = npc.name || npc.id || 'Unknown NPC'
  
  // Get conversation info
  const hasConversation = npc.conversations?.length > 0
  const conversationCount = npc.conversations?.length || 0
  
  // Get first conversation message
  const firstMessage = npc.conversations?.[0]?.message || 
                      (npc.conversations?.find((c: any) => c.message))?.message
  
  return (
    <div
      id={npc.id}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3 mb-3">
        {/* NPC Sprite/Image */}
        <div className="flex-shrink-0">
          {/* NPC Icon - same size as items */}
          <ItemIcon iconID={npc.iconID} iconBg={1} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {displayName}
          </h3>
          {/* Location */}
          <p className="text-sm text-blue-600 dark:text-blue-400">
            📍 {npc.location}
          </p>
        </div>
        
        <div className="text-right">
          {hasConversation && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              💬 {conversationCount} dialog{conversationCount !== 1 ? 's' : ''}
            </div>
          )}
          {npc.merchantItems?.length > 0 && (
            <div className="text-xs text-green-600 dark:text-green-400">
              🛒 {npc.merchantItems.length} items
            </div>
          )}
        </div>
      </div>
      
      {/* Show first conversation message if available */}
      {firstMessage && (
        <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-2">
          <p className="italic line-clamp-2">
            "{firstMessage}"
          </p>
        </div>
      )}
      
      {/* Show merchant items preview */}
      {npc.merchantItems?.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span className="font-medium">Selling:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {npc.merchantItems.slice(0, 3).map((item: any, index: number) => (
              <span key={index} className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                {item.name}
              </span>
            ))}
            {npc.merchantItems.length > 3 && (
              <span className="text-xs text-gray-500">+{npc.merchantItems.length - 3} more</span>
            )}
          </div>
        </div>
      )}
      
      {/* Debug info - simplified to avoid cyclic references */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2 text-xs text-gray-500">
          <summary>Debug Info</summary>
          <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            <div><strong>ID:</strong> {npc.id}</div>
            <div><strong>Name:</strong> {npc.name}</div>
            <div><strong>IconID:</strong> {npc.iconID}</div>
            <div><strong>Location:</strong> {npc.location}</div>
            <div><strong>Conversations:</strong> {npc.conversations?.length || 0}</div>
            <div><strong>Merchant Items:</strong> {npc.merchantItems?.length || 0}</div>
            <div><strong>PhraseID:</strong> {npc.phraseID}</div>
            <div><strong>DroplistID:</strong> {npc.droplistID}</div>
          </div>
        </details>
      )}
    </div>
  )
}