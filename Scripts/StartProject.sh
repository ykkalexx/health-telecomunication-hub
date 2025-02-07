#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check if required tools are installed
command -v dotnet >/dev/null 2>&1 || handle_error "dotnet is not installed"
command -v npm >/dev/null 2>&1 || handle_error "npm is not installed"

# Start the server in the background
echo "Starting .NET Server..."
cd Server || handle_error "Server directory not found"
dotnet run &
SERVER_PID=$!

# Start the client
echo "Starting React Client..."
cd ../Client || handle_error "Client directory not found"
npm install
npm run dev &
CLIENT_PID=$!

# Wait for user input to terminate
echo "Press any key to terminate both server and client..."
read -n 1

# Kill both processes
kill $SERVER_PID
kill $CLIENT_PID

echo "Server and client terminated."