import { MonsterCard, ResponsiveList } from '@/components'
import { monstersAtom } from '@/data'
import { useAtomValue } from 'jotai'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'preact/hooks'

// Sort options for monsters
const monsterSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'HP', value: 'maxHP' },
  { label: 'AP', value: 'maxAP' },
  { label: 'Attack Damage', value: 'attackDamage.max' },
  { label: 'Attack Chance', value: 'attackChance' },
  { label: 'Block Chance', value: 'blockChance' },
]

export const Monsters = () => {
  const monsters = useAtomValue(monstersAtom)
  const location = useLocation()

  const monsterType = location.pathname.split('/').pop()

  // Filter monsters by type if specified
  const filteredMonsters = monsters?.filter((monster: any) => {
    if (!monsterType || monsterType === 'monsters') return true
    return monster.monsterClass?.toLowerCase() === monsterType
  })

  // Handle hash navigation to scroll to specific monster
  useEffect(() => {
    if (location.hash && monsters) {
      const targetId = location.hash.slice(1) // Remove # from hash
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Highlight the element briefly
          element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
          setTimeout(() => {
            element.style.backgroundColor = ''
          }, 2000)
        }
      }, 100) // Small delay to ensure DOM is rendered
    }
  }, [location.hash, monsters])

  return (
    <ResponsiveList
      entities={filteredMonsters}
      entityName="monsters"
      sortOptions={monsterSortOptions}
      searchFields={['name', 'monsterClass']}
      renderCard={(monster) => (
        <MonsterCard
          monster={monster}
          onClick={() => {/* Handle monster details */}}
        />
      )}
    />
  )
}
