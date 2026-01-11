// src/utils/api.ts

import { Category, CategoryFieldsResponse } from '@/types/category';

const BASE_URL = 'https://www.olx.com.lb/api';

/**
 * Fetch all categories from OLX API
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch category fields based on category slugs
 * @param categorySlugs - Array of category slugs or single slug
 */
export const fetchCategoryFields = async (
  categorySlugs: string | string[]
): Promise<CategoryFieldsResponse> => {
  try {
    const slugsParam = Array.isArray(categorySlugs)
      ? categorySlugs.join(',')
      : categorySlugs;

    const params = new URLSearchParams({
      categorySlugs: slugsParam,
      includeChildCategories: 'true',
      splitByCategoryIDs: 'true',
      flatChoices: 'true',
      groupChoicesBySection: 'true',
      flat: 'true',
    });

    const response = await fetch(`${BASE_URL}/categoryFields?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category fields');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category fields:', error);
    throw error;
  }
};