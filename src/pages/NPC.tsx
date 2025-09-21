import { NPCCard, NPCDataGrid, ResponsiveList } from '@/components'
import { npcsAtom } from '@/data'
import { useAtomValue } from 'jotai'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'preact/hooks'

// Sort options for NPCs
const npcSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Location', value: 'location' },
]

export const NPC = () => {
  const npcs = useAtomValue(npcsAtom)
  const location = useLocation()

  const npcType = location.pathname.split('/').pop()

  // Filter NPCs by type if specified
  const filteredNPCs = npcs?.filter((npc: any) => {
    if (!npcType || npcType === 'npc') return true

    // Use name for filtering, fall back to id
    const nameToFilter = (npc.name || npc.id || '').toLowerCase()
    const firstChar = nameToFilter[0]

    // Filter by alphabet ranges
    if (npcType === 'a-g') {
      return firstChar >= 'a' && firstChar <= 'g'
    }
    if (npcType === 'h-r') {
      return firstChar >= 'h' && firstChar <= 'r'
    }
    if (npcType === 's-z') {
      return firstChar >= 's' && firstChar <= 'z'
    }
    if (npcType === 'merchant') {
      return npc.merchantItems && npc.merchantItems.length > 0
    }

    return true
  })

  // Handle hash navigation to scroll to specific NPC
  useEffect(() => {
    if (location.hash && npcs) {
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
  }, [location.hash, npcs])

  return (
    <ResponsiveList
      entities={filteredNPCs}
      entityName="NPCs"
      sortOptions={npcSortOptions}
      searchFields={['id', 'name', 'location']}
      defaultSort="name"
      renderCard={(npc) => (
        <NPCCard
          npc={npc}
          onClick={() => {/* Handle NPC details */}}
        />
      )}
      renderGrid={(npcs) => (
        <NPCDataGrid npcs={npcs} />
      )}
    />
  )
}
