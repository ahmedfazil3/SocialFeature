import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyA4MGOKaVC7OGDYScyQH_MxPdwKikxjD6c",
  authDomain: "socialfeature-b57a8.firebaseapp.com",
  projectId: "socialfeature-b57a8",
  storageBucket: "socialfeature-b57a8.firebasestorage.app",
  messagingSenderId: "744665678301",
  appId: "1:744665678301:web:130607f34f82c36cac3634"
};

export const app = initializeApp(firebaseConfig);
