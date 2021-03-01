import {functionsForRegion} from './firebaseApp';
import {Photo, PlaceDetail} from './types';

// import functions from '@react-native-firebase/functions';

const details = functionsForRegion.httpsCallable('details');
export const getDetails = (place_id: string): Promise<PlaceDetail> =>
  details({place_id}).then((response) => response.data.result);
