import {LatLng} from 'react-native-maps';

export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object;
  terms: Object[];
  types: string[];
};

export type DirectionReady = {
  distance: number;
  duration: number;
  coordinates: LatLng[];
  fare: [null];
  waypointOrder: [[]];
};
