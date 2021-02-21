import {FirebaseFunctionsTypes} from '@react-native-firebase/functions';
import {functionsForRegion} from './firebaseApp';
import {Place} from './type';

// import functions from '@react-native-firebase/functions';

const places = functionsForRegion.httpsCallable('places');
export const getPlaces = async (): // : Promise<FirebaseFunctionsTypes.HttpsCallableResult>
Promise<Place[]> => {
  // try {
  const response = await places();

  // console.log('responseresponse', response);
  return response.data;
  // } catch (err) {
  //   console.error(err);
  // }
};
