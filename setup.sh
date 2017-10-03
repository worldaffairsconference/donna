#!/bin/bash

# Setup script

# Build directory and file structure
echo -e "Building file structure... \c"
mkdir src/config
echo "[done]"

# Generate config if none found
if [ ! -f src/config/constants.js ]; then

	echo -e "Generating config file...  \c"
  touch src/config/constants.js
  chmod 664 src/config/constants.js
  echo "Please enter your Firebase API Key (ask a WAC team member if you're confused):"
	read FIREBASEKEY
	if [ "$FIREBASEKEY" == "" ]; then
		FIREBASEKEY=''
	fi
  # Writes the constant statement to the constants.js file
  echo 'import firebase from "firebase";const config = {apiKey: "'"$FIREBASEKEY"'",authDomain: "worldaffairsconference-452d5.firebaseapp.com",databaseURL: "https://worldaffairsconference-452d5.firebaseio.com",projectId: "worldaffairsconference-452d5",storageBucket: "worldaffairsconference-452d5.appspot.com",messagingSenderId: "874965589479"};firebase.initializeApp(config);export const ref = firebase.database().ref();export const firebaseAuth = firebase.auth' >> src/config/constants.js
  echo "[done]"
else
	echo "Config file detected. None generated"
fi
