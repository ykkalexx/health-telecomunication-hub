#!/bin/bash

echo "Installing dependencies for both client and server..."

# Install server dependencies
cd Server || exit
dotnet restore
echo "Server dependencies installed ✅"

# Install client dependencies
cd ../Client || exit
npm install
echo "Client dependencies installed ✅"

echo "All dependencies installed successfully! 🚀"