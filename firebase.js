import {firebase} from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

export const auth = firebase.auth();
export const db = firebase.firestore();
