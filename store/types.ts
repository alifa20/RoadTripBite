export const MAP_TYPES = {
    GOOGLE: 'Google map',
    APPLE: 'Apple map',
    IN_APP: 'Inside current app',
  } as const;
  
  // export type MapType = typeof MAP_TYPES[keyof typeof MAP_TYPES];
  export type MapType = keyof typeof MAP_TYPES;


  export interface PlaceLocation {
    rating: number | null;
    userRatingsTotal: number | null;
    location: {
      lng: number;
      lat: number;
    };
    isOpen: boolean | null;
    address: string;
    placeId: string;
    name: string;
    priceLevel: number | null;
    photos: string[];
  }
  
  export interface LocationState {
    locations: PlaceLocation[];
    nextPageToken: string | null;
    selectedLocation: PlaceLocation | null;
    showBottomSheet:boolean
  }
  
  export const MIN_RATINGS = {
    ANY: 1,
    FOUR: 4,
    FOUR_FIVE: 4.5,
    FOUR_EIGHT: 4.8,
  } as const;

  export type MinRating = typeof MIN_RATINGS[keyof typeof MIN_RATINGS];
  
  export const MIN_REVIEW_COUNTS = {
    ANY: 1,
    TEN: 10,
    FORTY: 40,
    HUNDRED: 100,
    THREE_HUNDRED: 300,
    FIVE_HUNDRED: 500,
    THOUSAND: 1000,
    TWO_THOUSAND: 2000,
    FOUR_THOUSAND: 4000,
  } as const;

  export type MinReviewCount = typeof MIN_REVIEW_COUNTS[keyof typeof MIN_REVIEW_COUNTS];
  