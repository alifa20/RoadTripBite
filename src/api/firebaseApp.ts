import firebase from '@react-native-firebase/app';
import '@react-native-firebase/functions';

const defaultApp = firebase.app();
const functionsForRegion = defaultApp.functions('us-central1');

if (__DEV__) {
  functionsForRegion.useFunctionsEmulator('http://localhost:5001');
}

export {functionsForRegion};
