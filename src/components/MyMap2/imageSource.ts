import {Place} from '../../api/types';

export const getImageSource = (place: Place) => {
  let source = '';
  if (place.photos.length > 0) {
    source = place.photos[0].photo_reference;
  }
  const base64Icon = `data:image/png;base64,${source}`;
  return base64Icon;
};
