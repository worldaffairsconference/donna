import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

var config;

if (process.env.NODE_ENV == 'development') {
  config = require('./API').default;
} else {
  //VERY IMPORTANT: GITHUB SECRET MUST BE IN JSON.STRINGIFY FORMAT
  config = JSON.parse(process.env.REACT_APP_FIREBASE_APIKEY);
}

firebase.initializeApp(config);

const noLogin = firebase.initializeApp(config, 'noLogin');

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth();
export const firebaseAuthNoLogin = noLogin.auth(); 
