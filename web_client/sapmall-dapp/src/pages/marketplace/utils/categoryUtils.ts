import { CategoryTreeResp } from '../../../services/types/categoryTypes';

export function findCategoryById(
  categories: CategoryTreeResp[],
  targetId: number
): CategoryTreeResp | null {
  if (!targetId) return null;
  for (const category of categories) {
    if (category.id === targetId) {
      return category;
    }
    if (category.children?.length) {
      const found = findCategoryById(category.children, targetId);
      if (found) return found;
    }
  }
  return null;
}
