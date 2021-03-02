import {FirebaseFunctionsTypes} from '@react-native-firebase/functions';
import {functionsForRegion} from './firebaseApp';
import {Place} from './types';

// import functions from '@react-native-firebase/functions';

const places = functionsForRegion.httpsCallable('places');
export const getPlaces = (
  entities: string[],
  lat: number,
  lng: number,
  direction: string[],
  goingBy: string,
  time: string,
): Promise<Place[]> =>
  places({
    entities,
    lat,
    lng,
    direction,
    goingBy,
    time,
  }).then((response) => response.data);
// : Promise<FirebaseFunctionsTypes.HttpsCallableResult>
