import {functionsForRegion} from './firebaseApp';
import {Photo} from './types';

// import functions from '@react-native-firebase/functions';

const details = functionsForRegion.httpsCallable('details');
export const getDetails = (place_id: string): Promise<string> =>
  details({place_id}).then((response) => response.data);
