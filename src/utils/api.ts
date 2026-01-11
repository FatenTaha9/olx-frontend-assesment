
import { Category, CategoryFieldsResponse } from '@/types/category';

const BASE_URL = 'https://www.olx.com.lb/api';

const FETCH_CATEGORIES = '/categories';
const FETCH_CATEGORY_FIELDS = '/categoryFields';


export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}${FETCH_CATEGORIES}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Category[] = await response.json();
    console.log('Fetched Categories:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchCategoryFields = async (
  categorySlug: string
): Promise<CategoryFieldsResponse> => {
  try {

    const params = new URLSearchParams({
      categorySlugs: categorySlug,
      includeChildCategories: 'true',
      splitByCategoryIDs: 'true',
      flatChoices: 'true',
      groupChoicesBySection: 'true',
      flat: 'true',
    });

    const response = await fetch(`${BASE_URL}${FETCH_CATEGORY_FIELDS}?${params}`);
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