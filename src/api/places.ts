import {FirebaseFunctionsTypes} from '@react-native-firebase/functions';
import {functionsForRegion} from './firebaseApp';
import {Place} from './types';

// import functions from '@react-native-firebase/functions';

const places = functionsForRegion.httpsCallable('places');
export const getPlaces = (): // : Promise<FirebaseFunctionsTypes.HttpsCallableResult>
Promise<Place[]> => places().then((response) => response.data);
