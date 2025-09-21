import { CategoryCard, CategoryDataGrid, ResponsiveList } from '@/components'

// Sort options for categories
const categorySortOptions = [
  { label: 'Name', value: 'name' },
]
import { categoriesAtom } from '@/data'
import { useAtomValue } from 'jotai'

export const Categories = () => {
  const categories = useAtomValue(categoriesAtom)

  return (
    <ResponsiveList
      entities={categories}
      entityName="categories"
      sortOptions={categorySortOptions}
      searchFields={['name']}
      renderCard={(category) => (
        <CategoryCard
          category={category}
          onClick={() => {/* Handle category details */}}
        />
      )}
      renderGrid={(categories) => (
        <CategoryDataGrid categories={categories} />
      )}
    />
  )
}
