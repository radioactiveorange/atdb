import { Sprite } from './Sprite'

interface Monster {
  id: string
  name: string
  iconID: string
  maxHP?: number
  maxAP?: number
  attackDamage?: { min: number; max: number }
  attackChance?: number
  blockChance?: number
  spawnGroup?: string
  faction?: string
  monsterClass?: string
  [key: string]: any
}

interface Props {
  monster: Monster
  onClick?: () => void
}

export const MonsterCard = ({ monster, onClick }: Props) => {
  return (
    <div
      id={monster.id}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Sprite iconID={monster.iconID} iconBg={1} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-base">
            {monster.name}
          </h3>
          {monster.monsterClass && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {monster.monsterClass}
            </p>
          )}
        </div>
        {monster.maxHP && (
          <div className="text-right">
            <p className="font-medium text-red-600 dark:text-red-400">
              {monster.maxHP}
            </p>
            <p className="text-xs text-gray-500">HP</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {monster.attackDamage && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded">
            <span className="font-medium">Damage:</span> {monster.attackDamage.min}-{monster.attackDamage.max}
          </div>
        )}
        {monster.maxAP && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            <span className="font-medium">AP:</span> {monster.maxAP}
          </div>
        )}
        {monster.attackChance && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
            <span className="font-medium">Hit:</span> {monster.attackChance}%
          </div>
        )}
        {monster.blockChance && (
          <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
            <span className="font-medium">Block:</span> {monster.blockChance}%
          </div>
        )}
        {monster.faction && (
          <div className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            <span className="font-medium">Faction:</span> {monster.faction}
          </div>
        )}
        {monster.spawnGroup && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            <span className="font-medium">Spawn:</span> {monster.spawnGroup}
          </div>
        )}
      </div>
    </div>
  )
}