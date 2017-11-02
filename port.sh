#!/bin/bash


echo "Enter desired port"
read USEPORT

if [[ $USEPORT == '' ]]; then
  USEPORT="3000"
fi

echo "PORT=${USEPORT}" > .env
echo '[done]'
echo "Site will be served on port ${USEPORT}"