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
  