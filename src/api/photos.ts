import {functionsForRegion} from './firebaseApp';
import {Photo} from './types';

// import functions from '@react-native-firebase/functions';

const photos = functionsForRegion.httpsCallable('photos');
export const getPhotos = (
  lat: number,
  lng: number,
  place_id: string,
  photoreference: string,
  maxwidth: number,
  maxheight: number,
): Promise<string> =>
  photos({photoreference, lat, lng, place_id, maxwidth, maxheight}).then(
    (response) => response.data,
  );
