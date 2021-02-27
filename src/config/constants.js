import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import API from './API';
var config;

if (process.env.NODE_ENV == 'development') {
  config = API;
} else {
  config = process.env.FIREBASE_APIKEY;
}

firebase.initializeApp(config);
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth();
