import { OptionalCategoryCriteria } from 'features/search/enums'

export const filterAvailableCategories = (
  selectedCategories: string[],
  availableCategories: OptionalCategoryCriteria
): string[] => {
  const availableFilters = Object.values(availableCategories).map(({ facetFilter }) => facetFilter)
  return availableFilters
    .filter((facetFilter) => selectedCategories.includes(facetFilter))
    .sort((a: string, b: string) => a.localeCompare(b))
}