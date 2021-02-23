import {functionsForRegion} from './firebaseApp';
import {Photo} from './types';

// import functions from '@react-native-firebase/functions';

const photos = functionsForRegion.httpsCallable('photos');
export const getPhotos = (
  photoreference: string,
  maxwidth: number,
  maxheight: number,
): Promise<string> =>
  photos({photoreference, maxwidth, maxheight}).then(
    (response) => response.data,
  );
