import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getPhotos} from '../../api/photos';
import {Place} from '../../api/types';
import StarRating from './StarRating';
const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
// const IMG_HIEIGHT = Math .floor(CARD_HEIGHT / 1.8);
const IMG_HIEIGHT = 120;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

interface Props {
  marker: Place;
  index: number;
}
const DetailCard = ({marker, index}: Props) => {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const reference = marker.photos[0].photo_reference;
        if (!reference) return;
        const photo = await getPhotos(
          reference,
          Math.floor(+CARD_WIDTH),
          IMG_HIEIGHT,
        );
        setImg(photo);
      } catch (err) {
        console.log('Something happened!', err);
      }
    })();
  }, [marker.place_id]);

  const goToMap = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${marker.geometry.location.lat},${marker.geometry.location.lng}`;
    const label = marker.name;

    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
      //   android: `${scheme}${label}(${label})`,
    }) as string;

    Linking.openURL(url);
  };
  return (
    <TouchableWithoutFeedback key={index} onPress={goToMap}>
      <View style={styles.card}>
        <View style={{height: IMG_HIEIGHT, justifyContent: 'center'}}>
          {img === null && <ActivityIndicator />}
          {img !== null && img !== '' && (
            <Image
              //   source={marker.image}
              // source={{uri: getImageSource(marker)}}
              source={{uri: img}}
              style={styles.cardImage}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>
            {/* {marker.title} */}
            {marker.name}
          </Text>
          <StarRating
            ratings={marker.rating}
            //   reviews={marker.reviews}
            reviews={marker.rating}
          />
          <Text numberOfLines={1} style={styles.cardDescription}>
            {/* {marker.description} */}
            {marker.rating}
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={goToMap}
              style={[
                styles.signIn,
                {
                  borderColor: '#FF6347',
                  borderWidth: 1,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#FF6347',
                  },
                ]}>
                Direction
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default DetailCard;
