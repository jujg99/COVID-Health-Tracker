#!/usr/bin/env bash

# Go to the React Application
cd react-application/;

# Build the Application
npm run build;

# Go back to the Root Directory
cd ../;

# Copy all the build files to public assets of the Backend
cp -r react-application/build/* backend/public;
