#!/bin/bash

# Swiss Pairing System - Quick Start Script
# This script helps you set up and run the application

echo "🏆 Swiss Pairing System Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH"
    echo "   If using MongoDB Atlas, you can ignore this."
    echo "   Otherwise, install MongoDB: https://www.mongodb.com/try/download/community"
else
    echo "✅ MongoDB found: $(mongod --version | head -n 1)"
fi

echo ""
echo "================================"
echo "Setting up Backend..."
echo "================================"

# Navigate to backend directory
cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating default..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swiss-pairing
NODE_ENV=development
EOF
    echo "✅ Created .env file"
    echo "   Please update MONGODB_URI if using MongoDB Atlas"
fi

echo ""
echo "================================"
echo "Setting up Frontend..."
echo "================================"

# Navigate to frontend directory
cd ../frontend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start MongoDB (if using local installation):"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo "   Windows: net start MongoDB"
echo ""
echo "2. Start the backend (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more information, see README.md"
echo ""
