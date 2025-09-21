import { useState } from 'preact/hooks'

interface QuestStage {
  progress: number
  logText: string
  rewardExperience?: number
  finishesQuest?: number
}

interface Quest {
  id: string
  name?: string
  logText?: string
  rewardText?: string
  showInLog?: number
  stages?: QuestStage[]
  [key: string]: any
}

interface Props {
  quest: Quest
  onClick?: () => void
}

export const QuestCard = ({ quest, onClick }: Props) => {
  // Determine quest content based on data structure
  const hasStages = quest.stages && quest.stages.length > 0
  const questText = hasStages ? quest.stages[0]?.logText : quest.logText
  const completedStages = hasStages ? quest.stages.filter(stage => stage.finishesQuest) : []
  const totalXPReward = completedStages.reduce((sum, stage) => sum + (stage.rewardExperience || 0), 0)

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
            {quest.name || quest.id}
          </h3>
          {questText && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {questText}
            </p>
          )}
        </div>
        
        {/* Quest metadata */}
        <div className="text-right flex-shrink-0">
          {hasStages && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {quest.stages.length} stages
            </div>
          )}
          {totalXPReward > 0 && (
            <div className="text-xs text-green-600 dark:text-green-400">
              {totalXPReward} XP
            </div>
          )}
        </div>
      </div>

      
      {/* Simple quest reward */}
      {!hasStages && quest.rewardText && (
        <div className="mt-3 text-xs">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
            <span className="font-medium">Reward:</span> {quest.rewardText}
          </div>
        </div>
      )}
    </div>
  )
}