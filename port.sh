#!/bin/bash


echo "enter desired port"
read USEPORT

if [[ $USEPORT == '' ]]; then
  USEPORT="3000"
fi

echo "PORT=${USEPORT}" > .env