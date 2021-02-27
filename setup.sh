#!/bin/bash

# Setup script

# Build directory and file structure
echo -e "Building file structure... \c"
mkdir -p src/config
echo "[done]"

# Generate config if none found
if [ ! -f src/config/API.js ]; then

	echo -e "Generating config file...  \c"
  touch src/config/API.js
  chmod 664 src/config/API.js
  echo "Please enter your Firebase Config Object. Make sure to remove all newlines before pasting. (ask a WAC team member if you're confused):"
	read FIREBASECONFIG
	if [ "$FIREBASECONFIG" == "" ]; then
		FIREBASECONFIG=''
	fi
  # Writes the constant statement to the constants.js file
  echo -e 'const API = '"$FIREBASECONFIG"';\nexport default API;' >> src/config/API.js
  echo "[done]"
else
	echo "Config file detected. None generated"
fi
