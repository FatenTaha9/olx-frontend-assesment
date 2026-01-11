export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  children?: Category[];
  parentID?: number;
}

export interface CategoryResponse {
  data: Category[];
}

// Field value types from OLX API
export type FieldValueType =
  | 'enum'
  | 'enum_multiple'
  | 'string'
  | 'integer'
  | 'float';

// Filter types from OLX API
export type FilterType =
  | 'single_choice'
  | 'multiple_choice'
  | 'range';

export interface FieldChoice {
  id: number | string;
  value: string;
  label: string;
  label_l1?: string;
  slug?: string;
  seoSlug?: {
    en: string;
    ar: string;
  };
  extraFields?: Record<string, unknown>;
  displayPriority?: number;
  popularityRank?: number;
  roles?: string[];
}

export interface ChoiceGroup {
  label: string;
  label_l1: string;
  displayPriority: number;
  choices: {
    all: FieldChoice[];
  };
  id: string;
}

export interface CategoryField {
  id: number;
  name: string;
  attribute: string;
  valueType: FieldValueType;
  filterType: FilterType;
  isMandatory: boolean;
  roles: string[];
  choices?: FieldChoice[];
  choiceGroups?: Record<string, ChoiceGroup>;
  minValue?: number | null;
  maxValue?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  categoryID: number;
  groupIndex: number;
  paaSection?: number | null;
  displayPriority: number;
  state: string;
}

export interface CategoryFieldsResponse {
  [categoryId: string]: {
    flatFields: CategoryField[];
  };
}
export interface FormData {
  [fieldName: string]: string | number | string[] | boolean;
}