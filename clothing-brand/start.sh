#!/bin/bash

echo "Starting 6IX Clothing Brand..."
echo

echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Checking if MongoDB is running..."
echo "You need to have MongoDB running locally or update the MONGO_URI in backend/config.env"

echo
echo "Starting backend server..."
cd backend
echo "Installing dependencies..."
npm install
echo
echo "Seeding database..."
npm run seed
echo
echo "Starting server..."
npm run dev &
BACKEND_PID=$!

echo
echo "Backend server started at http://localhost:5000"
echo
echo "To start the frontend:"
echo "1. Open a new terminal"
echo "2. Navigate to the project root"
echo "3. Run: npx serve . -p 8000"
echo "4. Open http://localhost:8000/html/index.html"
echo
echo "Press Ctrl+C to stop the backend server"
wait $BACKEND_PID 