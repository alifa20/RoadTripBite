export interface Location {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Location;
  southwest: Location;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface OpeningHours {
  open_now: boolean;
  weekday_text?: any[];
}

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}

export interface Place {
  business_status: string;
  geometry: Geometry;
  icon: string;
  name: string;
  opening_hours: OpeningHours;
  photos: Photo[];
  place_id: string;
  plus_code: PlusCode;
  price_level?: number;
  rating: number;
  reference: string;
  scope: string;
  types: string[];
  user_ratings_total: number;
  vicinity: string;
}

/**
 * Place details
 */

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface PlaceDetail {
  formatted_address: string;
  geometry: Geometry;
  name: string;
  opening_hours: OpeningHours;
  photos: Photo[];
  rating: number;
}



