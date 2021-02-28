import React, {useState} from 'react';
import {Button, Dimensions, Image, SafeAreaView} from 'react-native';
import {getPhotos} from '../../api/photos';

const {width} = Dimensions.get('window');
const CARD_HEIGHT = 220 / 2;
const CARD_WIDTH = width * 0.8;

const temp =
  'https://lh3.googleusercontent.com/p/AF1QipNdcOCXMZw68I_bc3YRPdc38RAihN5rKGOhX0lj=s1600-w331-h110';

const TestImage = () => {
  const ref =
    'ATtYBwKXw-CL3t7gOnD_5UNQrVwKXBH6baz9bwXBSnMfiIMzJnoYkl7QlP3Umy2q8T-Rth0eJHScUTRfKIC8SV1QTYBK9KTt1ZRrWiOlFMBTqizhjPwjXbdJrXHqWLfAuqIKwXDvT34jnmU0KxNXfF-VPfMzSYGKuajFvSbwWm6jT-hPfcWs';
  // 'ATtYBwLEdriMP4a7iJw9NJpqPFU0pJFw55OeqcTR4Y3ulG6LYcNRYIj3L5HX7BMVoLrR6OZMhcNLr1KXkD539vrZniFmuMKMQX75__pLcmqb0USgoHGDrVJOTtiqsXx3R-sFodoukq6u4k05_Tz57_HGmRGE4CXz5Lw1xvDrDvd4-i7UdehN';
  // 'ATtYBwJeRzUhuqYrplBcE8nxqdmKX5dOKoAc6GGvS4ic9pfGqmb6yhX1oAUH0Jn9xEIwrVyEGpzhZNDSHQhUWXLBjUgKWFE0Erm1zW5wfP1-IQvsg6RvcLIwhSzQo_3UbYI2S9Xce5-gkmTiYuBBOOajJIloQdL-S6METuLQ8Va0vsiC0QZT';
  // 'ATtYBwIM1AVqyWanINpklIKKHlonqW11Na4431wkmZ1mQShUYId6_SVECoKqyJhg53lc_DQVgqQeV0VdvQ7-_i8OYOEIIC5FL8WLnsPr436WKf2GY3TmNOJurXtGfd0ooMMYvAWONcM7l__LFcKUik-gyOk8ZuQcIxAF09MOYe9QA_S1CpTw';
  // 'ATtYBwLaguAPHHFHlK-7S2Ec493KNMv18tNseyHG1f1Hh4xrmx41apTTgRDgAjAdG3oSOhS4ndmJYMg4amSGhuGNN_O1hz-l1jDwLLT12Y9QnOrbc7aGKR4VVkVsdCin2aYviEyIgq76kDqJF-x3sGWzU1OuAuHpXL5rI-7ByIYVrBPcFAhf';
  // 'ATtYBwLG7UoemzkSYwxC6VSXaz8lRbZ309YnCq6-Kfy6KTeDyiSujxe-nYBR30fV1dSlk0M-nTX6TNzTAhXzqYGpldHQezz78OJyp4WAH-5v7rdHwGns54qAZVt3nU1xdJo3plTLU5Y9f3HknvvuqP1ShuvtCh0qOBBj3EfEFf7uSTT62ziu';
  // 'ATtYBwIonYNDr2ng4PNXxA7QAr7ttaLfJVw38yKKH7dAcITfU1vMFHHSf8B11Ktgi9Irf_CDtX5RGQ67e4PHunGj0IE1_IJHLryYuFbGX-p7W7P62OstHQarpa2150OAv0cVIgJ4vFZS5v55mEi4Yahjhzn3_JQpp3-I2pJCLYvABoQpbbbV';
  // 'ATtYBwLqo9ix3jY5rGsE8bo7qf5ihZWBv3bkxtmj4hlSNpTrI7VTHDrt3-DtAMPdtEVd5oBpScsfOIHaXRJDsYU73BV7b7mzlezQQrkgMqMim9uXcj2B1PHWBEf9mqLjYangfWllUzaMnZzYDBlybIXrhTeD9NSL1nSLs92WoJhJanYO_woJ';
  // 'ATtYBwLGvOgCxF_urS-LZoCriA0sTp5WB1FxH0f34FNGKjAJCehbdyJf-GZ-npzZWDo-Da2-KTJB0Vy-15QxFpzZehep9YNqHDpDn9C238lWdFstybqVh037gC8sAnNR8st9N5ZMvA9jQmPlsEMiyo8L1Zx4U6CsUP_WYYGXn3fseqyNxJc3';
  // 'ATtYBwJ0FFeodVr0r88HjAzmI509Kjj62c9ReoUygp2DgAJyCxry9u_7NwocpC5-ijb38pKFX9MdYJ5TMm33R-zf32daiJMF7y76sBGMNhYyotrTPPEePXojVJViHN788ve-5khhmJUrYqF__OCQYkwJDte7bKe_qF1HHZtDKm4Rjovy18zC';
  // 'ATtYBwLLON3pH8HY4a81uZ3dQKZaEmVDZy20JArNDPzeHxRdAYrB44ed66pG3vX9-dIvhcv8cssNTIwm_NCNWatY8OB1XVQI6Bb7UVSsSB2MjyRxtMUsTpv1SUCpaHAXh7OugMn2LitR6Nyk5im0uhaHRrC27avLwb82qjAVwrrj1R1iP5t1';
  // 'ATtYBwLprgi2p4CO9FEUMERnbaetm5MUPiudQ-qPD08GFYoZJS-h4kvqAVEQaAJKDF_N1OxGgpEEtCw9___Yi1bgg_Spn2SqBPXzh8xegv19MTWkulTKNgbMYCVFzP863J2G8WGryCvFgjrYuBrhbB4G-RF6GIFJNiX052QCkhxl2uKLfD5v';
  // 'ATtYBwIJt_7xRwV2XYIBECwJ-UJPcPl-JKYyWUlDnMm_IyYqn6bW2zM82O_zP4z8Y6X0O5trxAQdNwCX4P_qo_k1_fjN_R670q21XaQq5wwjfj0StT81YNaClWCapXNUjlvcVLk-wPjY5LG3-FSVhooCHGnv4COwZCMHHHvQgKL4uUygvOF_';
  // 'ATtYBwJWYrtXNDRS6H5T60Azt5DEUTPnJL4lC2DFNGBIluJQnUVdYTC9VjRSmAy7SaGTRoeWUz4xYt6C0BUfNiLicjdYGSChHJ5Stz0yoxeUfWJbEL9ohA3eJpyShzpaiRaUscXUZtA_5GbQKxZBHpRRzoQmRZlVAaQo5KTsk4T_x-Oqa-cX';
  const [img, setImg] = useState<string | null>(temp);
  // const base64Icon = img
  //   ? 'data:image/png;base64,ATtYBwKXw-CL3t7gOnD_5UNQrVwKXBH6baz9bwXBSnMfiIMzJnoYkl7QlP3Umy2q8T-Rth0eJHScUTRfKIC8SV1QTYBK9KTt1ZRrWiOlFMBTqizhjPwjXbdJrXHqWLfAuqIKwXDvT34jnmU0KxNXfF-VPfMzSYGKuajFvSbwWm6jT-hPfcWs='
  //   : '';

  // useEffect(() => {
  //   (async () => {
  //     const photo = await getPhotos(ref, Math.floor(+CARD_WIDTH), +CARD_HEIGHT);

  //     // setUri(photo);
  //     setImg(photo);
  //   })();
  // }, [ref]);
  const base64Icon = img ? `data:image/png;${img}` : '';

  const onPress = async () => {
    try {
      const photo = await getPhotos(ref, Math.floor(+CARD_WIDTH), +CARD_HEIGHT);

      // setUri(photo);
      setImg(photo);
      // console.log('photophoto', photo);
    } catch (err) {
      console.error('errerrerrerrerr', err);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="hey" onPress={onPress} />
      {/* <Image style={{flex: 1}} source={{uri: img}} resizeMode="contain" /> */}
      <Image
        style={{flex: 1}}
        // source={{uri: base64Icon}}
        source={{uri: img}}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};
export default TestImage;
