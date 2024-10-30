export const MAP_TYPES = {
    GOOGLE: 'Google map',
    APPLE: 'Apple map',
    IN_APP: 'Inside current app',
  } as const;
  
  // export type MapType = typeof MAP_TYPES[keyof typeof MAP_TYPES];
  export type MapType = keyof typeof MAP_TYPES;