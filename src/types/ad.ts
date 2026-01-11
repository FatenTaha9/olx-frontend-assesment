export interface SearchParams {
  parentCategorySlug?: string;
  categorySlug?: string;
}

export interface SearchInformation {
  nb_hits: number;
  search_params?: SearchParams;
  route_name?: string;
}

export interface AdExtraFields {
  // use a flexible map because extra fields vary by category
  [key: string]: string | number | boolean | null;
}

// New: common/base ad fields used by all specific ad types
export interface BaseAd {
  search_information?: SearchInformation;
  facebook_browser_id?: string;
  google_client_id?: string;
  client_ip?: string;
  client_device_id?: string;
  client_device_description?: string;
  client_user_external_id?: string;
  client_session_id?: string;
  timestamp?: number;
  app_type?: string;
  metric_entity?: string;
  metric_source?: string;
  metric_action?: string;
  ad_image_url?: string;
  ad_location_l3_external_id?: string;
  ad_location_l3_name_en?: string;
  ad_location_l3_name_lc?: string;
  ad_location_external_id?: string;
  ad_location_name_en?: string;
  ad_location_name_lc?: string;
  ad_agent_external_id?: string;
  ad_agent_name?: string;
  ad_agency_external_id?: string;
  ad_category_external_id?: string;
  ad_product?: string;
  ad_price?: number;
  ad_title?: string;
  ad_source?: string;
  ad_type?: string;
  ad_external_id?: string;
  ad_source_id?: number;
  trace_id?: string;
}

// Specific ad types extend the base and add category-specific fields
export interface CarAd extends BaseAd {
  // cars may have extra fields like mileage, fuel_type, year, etc.
  ad_extra_fields?: AdExtraFields;
}

export interface PropertyAd extends BaseAd {
  // properties have area and room counts (bedroom could be string or number in data)
  ad_area?: number;
  ad_bathroom_count?: number;
  ad_bedroom_count?: string | number;
}

export interface MobileAd extends BaseAd {
  // mobiles might use ad_extra_fields as well, but in provided samples they didn't.
  ad_extra_fields?: AdExtraFields;
}

export type adsTypes = 'car' | 'property' | 'mobile';

// Backwards-compatible discriminated Ad union matching mockAds structure
export type AdItem = {
  type: adsTypes;
  ads: CarAd[] | PropertyAd[] | MobileAd[];
}

export type Ad = AdItem[];

// Generic AdListResponse so callers can type arrays of specific ad types
export interface AdListResponse<T = BaseAd> {
  ads: T[];
  total: number;
  page: number;
  perPage: number;
}