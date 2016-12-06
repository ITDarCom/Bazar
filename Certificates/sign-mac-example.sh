#!/bin/bash

jarsigner -verbose -keystore ebazaar.keystore "$1" ebazaar

echo ""
echo ""
echo "Checking if APK is verified..."
jarsigner -verify "$1"

