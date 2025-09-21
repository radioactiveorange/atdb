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

  console.log('Debug - Conditions length:', conditions?.length)
  console.log('Debug - Condition type:', conditionType)
  console.log('Debug - Sample condition:', conditions?.[0])
  console.log('Debug - Sample isPositive values:', conditions?.slice(0, 5)?.map(c => c.isPositive))

  // Filter conditions by type if specified
  const filteredConditions = conditions?.filter((condition: any) => {
    if (!conditionType || conditionType === 'conditions') return true
    if (conditionType === 'positive') return condition.isPositive === 1
    if (conditionType === 'negative') return !condition.isPositive || condition.isPositive === 0
    return false
  }) || []

  console.log('Debug - Filtered length:', filteredConditions.length)

  if (!conditions) {
    return <div className="p-4 text-center">Loading conditions...</div>
  }

  if (filteredConditions.length === 0) {
    return <div className="p-4 text-center">No conditions found for "{conditionType}"</div>
  }

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
