# Swiss Pairing System - Quick Start Guide

## Quick Setup (All Platforms)

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (v14 or higher)
2. Install [MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)

### macOS/Linux Setup

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### Windows Setup

```powershell
# Open PowerShell in project directory

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Option 1: Using Terminal/Command Prompt

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Using VS Code

1. Open two integrated terminals
2. In Terminal 1: `cd backend && npm run dev`
3. In Terminal 2: `cd frontend && npm start`

## MongoDB Setup

### Option A: Local MongoDB

**macOS:**
```bash
# Install MongoDB with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
mongosh
```

**Windows:**
1. Download MongoDB Community Server
2. Install with default settings
3. MongoDB runs as a service automatically

**Linux (Ubuntu):**
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: MongoDB Atlas (Cloud - Recommended for Beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing
   ```

## Verify Installation

### Check Backend
Open browser to: `http://localhost:5000/api/health`

Should see: `{"status":"OK","message":"Server is running"}`

### Check Frontend
Open browser to: `http://localhost:3000`

Should see the Swiss Pairing System homepage.

## First Steps

1. **Create a Tournament**
   - Click "Create New Tournament"
   - Enter name and date
   - Set number of rounds (default: 5)

2. **Add Players**
   - Option A: Add individually via form
   - Option B: Upload Excel file (see EXCEL_TEMPLATE_GUIDE.md)

3. **Generate Pairings**
   - Click "Generate Round 1 Pairings"
   - View pairings in Pairings tab

4. **Record Results**
   - Select round
   - Choose result for each game
   - Points update automatically

5. **Share with Users**
   - Copy the "Public View Link"
   - Share with participants
   - They can view standings and pairings

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongosh` (should connect)
- Verify `.env` file exists in backend folder
- Check port 5000 is not in use: `lsof -i :5000` (macOS/Linux)

### Frontend won't start
- Check port 3000 is not in use
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Can't connect to database
- Local MongoDB: Ensure `mongod` is running
- Atlas: Check connection string, username, password
- Firewall: Ensure no firewall blocking connections

### Excel upload fails
- Check file format (.xlsx or .xls)
- Verify columns: Name, Rating, University
- Ensure Rating is numeric
- See EXCEL_TEMPLATE_GUIDE.md for details

## Common Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm start           # Start server (production)
npm run dev         # Start with auto-reload (development)

# Frontend
cd frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production

# MongoDB
mongosh             # Open MongoDB shell
brew services start mongodb-community  # Start MongoDB (macOS)
sudo systemctl start mongod           # Start MongoDB (Linux)
net start MongoDB                     # Start MongoDB (Windows)
```

## Default Ports

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swiss-pairing
NODE_ENV=development
```

### Frontend
Uses proxy to backend (configured in package.json)

## Next Steps

- Read full README.md for detailed documentation
- Check EXCEL_TEMPLATE_GUIDE.md for bulk upload
- Explore API endpoints in README.md
- Customize styling in frontend/src/index.css

## Getting Help

- Check README.md for detailed docs
- Review error messages in terminal
- Verify MongoDB connection
- Check browser console for frontend errors

## Production Deployment

For production deployment:
1. Build frontend: `cd frontend && npm run build`
2. Serve frontend build with backend
3. Use production MongoDB (MongoDB Atlas recommended)
4. Set environment variables on hosting platform
5. Use process manager like PM2 for backend

Happy tournament organizing! ♟️
