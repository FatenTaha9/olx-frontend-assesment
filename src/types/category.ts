// src/types/category.ts

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  children?: Category[];
  parentId?: number;
}

export interface CategoryResponse {
  data: Category[];
}

// Field types from OLX API
export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'range'
  | 'textarea';

export interface FieldChoice {
  id: string | number;
  label: string;
  value: string;
}

export interface CategoryField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  choices?: FieldChoice[];
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface CategoryFieldsResponse {
  [categoryId: string]: {
    flatFields: CategoryField[];
  };
}

export interface FormData {
  [fieldName: string]: string | number | string[] | boolean;
}