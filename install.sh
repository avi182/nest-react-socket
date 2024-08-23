#!/bin/bash

echo "Installing client dependencies..."
cd client
yarn install

cd ..

echo "Installing server dependencies..."
cd server
yarn install

echo "Installation complete!"