import { ConditionCard, ResponsiveList } from '@/components'

// Sort options for conditions
const conditionSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Category', value: 'category' },
  { label: 'Duration', value: 'duration' },
]
import { conditionsAtom } from '@/data'
import { useAtomValue } from 'jotai'
import { useLocation } from 'react-router-dom'

export const Conditions = () => {
  const conditions = useAtomValue(conditionsAtom)
  const location = useLocation()
  
  const conditionType = location.pathname.split('/').pop()

  // Filter conditions by type if specified
  const filteredConditions = conditions?.filter((condition: any) => {
    if (!conditionType || conditionType === 'conditions') return true
    return condition.category?.toLowerCase() === conditionType
  })

  return (
    <ResponsiveList
      entities={filteredConditions}
      entityName="conditions"
      sortOptions={conditionSortOptions}
      searchFields={['name', 'category']}
      renderCard={(condition) => (
        <ConditionCard
          condition={condition}
          onClick={() => {/* Handle condition details */}}
        />
      )}
    />
  )
}
