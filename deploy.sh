#!/usr/bin/env bash

###
# Run on AWS EC2 with AMI for Ubuntu 20.04 LTS 64-bit x86
# Use t2.micro
# Configure Security Group and ACLs https://aws.amazon.com/premiumsupport/knowledge-center/connect-http-https-ec2/
# Create / Choose a key pair for remote login
# SSH into the instance
# Clone git repository
# Make .env files
# - backend/.env
#   - PORT=???
#   - DB_PORT=???
#   - DB_SECRET=???
#   - DB_HOST=???
#   - DB_USER=???
#   - DB_PASSWORD=???
#   - GOOGLE_API=???
# - react-application.env
#   - REACT_APP_GOOGLE_API=???
# Run this script
###

# Update
sudo apt-get update

# Install
sudo apt-get install nginx
sudo apt install mysql-server
sudo mysql_secure_installation
sudo mysql
# Run ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
# Run FLUSH PRIVILEGES;
# Run exit
sudo apt install nodejs
sudo apt install npm
sudo npm install --global yarn

# Install Dependencies
cd react-application
yarn
cd ..
cd backend
yarn
cd ..

# Build and Copy React Build
./copy_react_build.sh

# Run backend in background
cd backend
yarn start > /dev/null 2>&1 &
cd ..

# Copy nginx configuration
nginx_default > /etc/nginx/sites-available/default

# Run NGINX
sudo service nginx restart
