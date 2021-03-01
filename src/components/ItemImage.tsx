import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, StyleSheet} from 'react-native';
import {getPhotos} from '../api/photos';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const IMG_HIEIGHT = 120;

interface Props {
  //   img: string | null;
  photo_reference: string;
}

const ItemImage = ({photo_reference}: Props) => {
  const [img, setImg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!photo_reference) return;
        const photo = await getPhotos(
          photo_reference,
          Math.floor(+CARD_WIDTH),
          IMG_HIEIGHT,
        );
        setImg(photo);
      } catch (err) {
        console.log('Something happened!', err);
      }
    })();
  }, [photo_reference]);

  return (
    <>
      {img === null && <ActivityIndicator />}
      {img !== null && img !== '' && (
        //   source={marker.image}
        // source={{uri: getImageSource(marker)}}
        <Image
          source={{uri: img}}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});

export default ItemImage;
