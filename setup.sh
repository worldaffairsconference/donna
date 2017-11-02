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
  echo "Please enter your Firebase Config Object (ask a WAC team member if you're confused):"
	read FIREBASECONFIG
	if [ "$FIREBASECONFIG" == "" ]; then
		FIREBASECONFIG=''
	fi
  # Writes the constant statement to the constants.js file
  echo 'import firebase from "firebase";const config = '"$FIREBASECONFIG"';firebase.initializeApp(config);export const ref = firebase.database().ref();export const firebaseAuth = firebase.auth' >> src/config/constants.js
  echo "[done]"
else
	echo "Config file detected. None generated"
fi
