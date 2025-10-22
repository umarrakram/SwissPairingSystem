# Deployment Guide - Swiss Pairing System

This guide covers running the application locally and deploying to production (Vercel).

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Running the Application Locally](#running-the-application-locally)
3. [Admin vs User Dashboard Configuration](#admin-vs-user-dashboard-configuration)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [Production Configuration](#production-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

Before starting, ensure you have:
- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB** (Local installation OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)
- **Git** (optional, for version control)

### Step 1: Install MongoDB

#### Option A: Local MongoDB (Recommended for Development)

**macOS:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer (use default settings)
3. MongoDB runs as a Windows service automatically
4. Verify: Open Command Prompt and run `mongosh`

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free Tier M0)
4. Wait for cluster to be created (2-5 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
7. Replace `<password>` with your actual password
8. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing`

### Step 2: Install Dependencies

#### Automated Setup (Recommended)
```bash
# Navigate to project root
cd /Users/umarrakram/Desktop/Projects/SwissPairingSystem

# Run setup script (macOS/Linux)
chmod +x setup.sh
./setup.sh
```

The script will:
- Check Node.js installation
- Install backend dependencies
- Install frontend dependencies
- Create `.env` file if missing

#### Manual Setup

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Configure Environment Variables

Create/edit `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/swiss-pairing

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing

# Optional: CORS Configuration (if frontend runs on different port)
# CORS_ORIGIN=http://localhost:3000
```

**Important Notes:**
- Never commit `.env` to Git (it's in `.gitignore`)
- For production, use environment variables on your hosting platform
- MongoDB Atlas requires network access whitelist (add `0.0.0.0/0` for development)

---

## Running the Application Locally

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB connected successfully
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view swiss-pairing-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Option 2: Using VS Code Split Terminals

1. Open project in VS Code
2. Open Terminal (`` Ctrl+` `` or `` Cmd+` ``)
3. Click the split terminal icon (+) to create two terminals
4. In Terminal 1: `cd backend && npm run dev`
5. In Terminal 2: `cd frontend && npm start`

### Option 3: Using tmux (Advanced)

```bash
# Start tmux
tmux

# Split window horizontally
Ctrl+b "

# In top pane
cd backend && npm run dev

# Switch to bottom pane (Ctrl+b, then down arrow)
# In bottom pane
cd frontend && npm start
```

### Accessing the Application

Once both servers are running:

- **Frontend (Main App):** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

You should see:
- Frontend: Swiss Pairing System homepage
- Backend health: `{"status":"OK","message":"Server is running"}`

---

## Admin vs User Dashboard Configuration

The application has **two distinct views** with different access levels:

### Admin Dashboard (Full Access)

**Access:** `http://localhost:3000/` or `http://localhost:3000/tournament/:id`

**Features:**
- Create/edit/delete tournaments
- Add/remove players (individual or bulk)
- Generate pairings for rounds
- Record match results
- Calculate tiebreaks
- Manage tournament status
- Access all administrative functions

**Routes:**
```javascript
/ → AdminDashboard (list all tournaments)
/tournament/:id → TournamentView (manage specific tournament)
  ├─ Players Tab → Add/remove players
  ├─ Pairings Tab → Generate pairings, record results
  └─ Standings Tab → View rankings
```

**Authentication:** Currently **NO authentication** is implemented. In production, you should add:
- Login system
- Admin passwords
- Session management
- JWT tokens

### User Dashboard (Read-Only)

**Access:** `http://localhost:3000/view/:shareLink`

**Features:**
- View tournament information
- View current standings
- View pairings for all rounds
- See match results
- Public access (no login required)

**Routes:**
```javascript
/view/:shareLink → UserView (public tournament view)
  ├─ Standings Tab → View rankings
  └─ Pairings Tab → View pairings and results
```

**How Share Links Work:**
1. When tournament is created, a unique `shareLink` is generated (uses tournament `_id`)
2. Admin can copy the link: `http://localhost:3000/view/[shareLink]`
3. Share with participants via email, WhatsApp, etc.
4. Users access read-only view without admin privileges

### Configuration for Different Dashboards

The application **automatically** routes to correct dashboard based on URL:

**In `frontend/src/App.js`:**
```javascript
<Routes>
  <Route path="/" element={<AdminDashboard />} />           {/* Admin */}
  <Route path="/tournament/:id" element={<TournamentView />} /> {/* Admin */}
  <Route path="/view/:shareLink" element={<UserView />} />  {/* User */}
</Routes>
```

**No additional configuration needed!** The routing is already set up.

### Separating Admin and User in Production

For production deployment with separate domains:

#### Option 1: Subdomain Approach
- Admin: `https://admin.yoursite.com`
- User: `https://view.yoursite.com`

#### Option 2: Path-based Approach (Current)
- Admin: `https://yoursite.com/`
- User: `https://yoursite.com/view/:shareLink`

#### Option 3: Separate Deployments
- Admin: Deploy to `admin-chess-tournament.vercel.app`
- User: Deploy to `chess-tournament-view.vercel.app`

**To implement separate deployments:**

1. **Create two separate frontend builds:**

```bash
# Admin build
cd frontend
REACT_APP_ADMIN_MODE=true npm run build

# User build
cd frontend
REACT_APP_USER_MODE=true npm run build
```

2. **Modify App.js to conditionally render:**

```javascript
// frontend/src/App.js
const isAdminMode = process.env.REACT_APP_ADMIN_MODE === 'true';

<Routes>
  {isAdminMode ? (
    <>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/tournament/:id" element={<TournamentView />} />
    </>
  ) : (
    <Route path="/" element={<UserView />} />
  )}
</Routes>
```

---

## Deploying to Vercel

Vercel is perfect for this stack because it supports both:
- **Frontend:** React (static or SSR)
- **Backend:** Node.js serverless functions

### Architecture on Vercel

```
Vercel Deployment:
├── Frontend (React) → Served as static site
└── Backend (Node.js) → Converted to Serverless Functions
```

### Prerequisites for Vercel Deployment

1. **Vercel Account:** Sign up at [vercel.com](https://vercel.com)
2. **Git Repository:** Push code to GitHub/GitLab/Bitbucket
3. **MongoDB Atlas:** Cloud database (local MongoDB won't work)

### Step 1: Prepare Backend for Serverless

Vercel uses serverless functions. We need to restructure the backend:

#### Create `backend/api` directory structure:

```bash
cd backend
mkdir -p api
```

#### Create serverless function files:

**File: `backend/api/tournaments.js`**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tournamentsRouter = require('../routes/tournaments');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = db;
  return db;
}

app.use('/api/tournaments', tournamentsRouter);

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
```

**Repeat for:** `players.js`, `pairings.js`, `rounds.js`

#### Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/tournaments/(.*)",
      "dest": "/api/tournaments.js"
    },
    {
      "src": "/api/players/(.*)",
      "dest": "/api/players.js"
    },
    {
      "src": "/api/pairings/(.*)",
      "dest": "/api/pairings.js"
    },
    {
      "src": "/api/rounds/(.*)",
      "dest": "/api/rounds.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri"
  }
}
```

### Step 2: Prepare Frontend for Vercel

#### Update `frontend/package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:5000"
}
```

#### Create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

#### Update API service to use environment variable:

**File: `frontend/src/services/api.js`**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Step 3: Deploy Backend to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd backend
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name? swiss-pairing-backend
# - Directory? ./
# - Override settings? N
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. Click "Deploy"

**Copy the deployment URL** (e.g., `https://swiss-pairing-backend.vercel.app`)

### Step 4: Deploy Frontend to Vercel

#### Update API URL:

Before deploying, update `frontend/.env.production`:
```env
REACT_APP_API_URL=https://swiss-pairing-backend.vercel.app/api
```

#### Deploy:

**Using Vercel CLI:**
```bash
cd frontend
vercel

# Follow prompts:
# - Project name? swiss-pairing-frontend
# - Directory? ./
# - Build command? npm run build
# - Output directory? build
```

**Using Vercel Dashboard:**
1. Click "Add New..." → "Project"
2. Import repository
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://swiss-pairing-backend.vercel.app/api`
5. Click "Deploy"

### Step 5: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain:
   - Frontend: `chess-tournament.com`
   - Backend: `api.chess-tournament.com`
4. Update DNS records as instructed by Vercel
5. Update `REACT_APP_API_URL` in frontend environment variables

---

## Production Configuration

### Environment Variables for Production

#### Backend (Vercel)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing
NODE_ENV=production
PORT=5000
```

#### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
NODE_ENV=production
```

### MongoDB Atlas Configuration

1. **Whitelist IP Addresses:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allows all - Vercel uses dynamic IPs)
   - Or add specific Vercel IP ranges

2. **Create Database User:**
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Grant read/write privileges
   - Save username and password for connection string

3. **Get Connection String:**
   - Go to Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with actual password
   - Add database name: `/swiss-pairing`

### CORS Configuration for Production

Update `backend/server.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend.vercel.app' 
    : 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
```

### Security Best Practices

1. **Never commit sensitive data:**
   - Keep `.env` files in `.gitignore`
   - Use Vercel environment variables

2. **Add authentication for admin routes:**
   - Implement JWT tokens
   - Add login page
   - Protect admin routes

3. **Rate limiting:**
   ```bash
   npm install express-rate-limit
   ```
   
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

4. **Input validation:**
   ```bash
   npm install express-validator
   ```

---

## Separate Admin and User Deployments

For completely separate admin and user deployments:

### Approach 1: Two Frontend Projects

**Structure:**
```
swiss-pairing-system/
├── backend/          (shared API)
├── frontend-admin/   (admin only)
└── frontend-user/    (public only)
```

**Deploy:**
1. Backend → `api.chess-tournament.com`
2. Admin Frontend → `admin.chess-tournament.com`
3. User Frontend → `chess-tournament.com`

### Approach 2: Environment-Based Routing

**In `frontend/src/App.js`:**
```javascript
const isAdminApp = process.env.REACT_APP_ADMIN_MODE === 'true';

function App() {
  return (
    <Router>
      <Routes>
        {isAdminApp ? (
          /* Admin routes */
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/tournament/:id" element={<TournamentView />} />
          </>
        ) : (
          /* User routes */
          <>
            <Route path="/" element={<TournamentList />} />
            <Route path="/:shareLink" element={<UserView />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
```

**Deploy twice with different env vars:**
```bash
# Admin deployment
REACT_APP_ADMIN_MODE=true vercel --prod

# User deployment  
REACT_APP_ADMIN_MODE=false vercel --prod
```

### Approach 3: Subdirectories

Keep current structure, use nginx/Vercel routing:

**`vercel.json` in frontend:**
```json
{
  "rewrites": [
    { "source": "/admin", "destination": "/" },
    { "source": "/admin/:path*", "destination": "/:path*" },
    { "source": "/view/:shareLink", "destination": "/index.html" }
  ]
}
```

Access:
- Admin: `yoursite.com/admin`
- User: `yoursite.com/view/:shareLink`

---

## Troubleshooting

### Local Development Issues

#### Backend won't start

**Problem:** `MongoDB connection error`
```bash
# Check if MongoDB is running
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
sc query MongoDB
```

**Solution:**
```bash
# Start MongoDB
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Frontend won't start

**Problem:** `Port 3000 already in use`
```bash
# Find and kill process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

#### Can't connect to API

**Problem:** CORS errors in browser console

**Solution:** Check `backend/server.js` has CORS enabled:
```javascript
app.use(cors());
```

### Vercel Deployment Issues

#### Build fails

**Problem:** `Module not found`

**Solution:**
- Check all dependencies are in `package.json`
- Run `npm install` locally first
- Check Node.js version compatibility

#### Backend timeouts

**Problem:** Serverless functions timeout after 10 seconds

**Solution:**
- Upgrade to Vercel Pro (60s timeout)
- Optimize database queries
- Add database indexes

#### Environment variables not working

**Problem:** `undefined` in production

**Solution:**
- Add variables in Vercel dashboard
- Prefix React variables with `REACT_APP_`
- Redeploy after adding variables

### Database Issues

#### MongoDB Atlas connection fails

**Problem:** `MongoNetworkError`

**Solution:**
- Check IP whitelist (add `0.0.0.0/0`)
- Verify username/password
- Check connection string format
- Ensure database user has permissions

#### Slow queries

**Solution:**
```javascript
// Add indexes in models
playerSchema.index({ tournament: 1 });
pairingSchema.index({ tournament: 1, round: 1 });
```

---

## Verification Checklist

### Local Development
- [ ] MongoDB is running
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 3000)
- [ ] Can create tournament
- [ ] Can add players
- [ ] Can generate pairings
- [ ] Can record results
- [ ] Can view standings
- [ ] Public link works

### Production Deployment
- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] MongoDB Atlas connection works
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] API endpoints respond correctly
- [ ] Frontend can reach backend
- [ ] Public links work
- [ ] Custom domain configured (if applicable)

---

## Quick Reference Commands

### Local Development
```bash
# Start MongoDB (macOS)
brew services start mongodb-community

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# View logs
# Backend: Check terminal
# Frontend: Check browser console
```

### Vercel Deployment
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# View logs
vercel logs [deployment-url]

# Set environment variable
vercel env add MONGODB_URI
```

### Database Commands
```bash
# MongoDB Shell
mongosh

# List databases
show dbs

# Use database
use swiss-pairing

# List collections
show collections

# Find all tournaments
db.tournaments.find()

# Clear database (CAREFUL!)
db.tournaments.deleteMany({})
db.players.deleteMany({})
db.pairings.deleteMany({})
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## Support

For issues:
1. Check this guide
2. Review error messages in terminal/console
3. Check Vercel deployment logs
4. Verify MongoDB Atlas connection
5. Review PROJECT_SUMMARY.md and README.md

Happy deploying! 🚀♟️
