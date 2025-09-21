import { QuestCard, QuestDataGrid, ResponsiveList } from '@/components'

// Sort options for quests
const questSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Stage', value: 'stage' },
]
import { questsAtom } from '@/data'
import { useAtomValue } from 'jotai'

export const Quests = () => {
  const quests = useAtomValue(questsAtom)

  return (
    <ResponsiveList
      entities={quests}
      entityName="quests"
      sortOptions={questSortOptions}
      searchFields={['name', 'logText']}
      renderCard={(quest) => (
        <QuestCard
          quest={quest}
          onClick={() => {/* Handle quest details */}}
        />
      )}
      renderGrid={(quests) => (
        <QuestDataGrid quests={quests} />
      )}
    />
  )
}
