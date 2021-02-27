import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
var config;

if (process.env.NODE_ENV == 'development') {
  const API = require('./API').default;
  config = API;
  console.log(config);
} else {
  config = process.env.FIREBASE_APIKEY;
}

firebase.initializeApp(config);
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth();
