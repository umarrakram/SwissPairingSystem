# Development vs Production Configuration

This document explains the differences between development and production setups for the Swiss Pairing System.

## 📁 File Structure

```
SwissPairingSystem/
├── backend/
│   ├── .env                    # Current environment (git-ignored)
│   ├── .env.development        # Development config
│   ├── .env.production         # Production template
│   ├── .env.example           # Template for new developers
│   ├── vercel.json            # Vercel backend configuration
│   └── server.js              # Express server with CORS
├── frontend/
│   ├── .env.development       # Development config
│   ├── .env.production        # Production template
│   ├── .env.example          # Template for new developers
│   ├── vercel.json           # Vercel frontend configuration
│   └── package.json          # With proxy for dev
├── deploy.sh                 # Automated deployment script
├── VERCEL_DEPLOYMENT.md      # Detailed Vercel guide
└── ENV_QUICK_REFERENCE.md    # Quick reference card
```

## 🔧 Development Configuration

### Backend (.env.development)
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/swiss-pairing
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.development)
```env
REACT_APP_API_URL=/api
REACT_APP_ENV=development
```

### How It Works (Development)
1. **Backend** runs on `localhost:5001`
2. **Frontend** runs on `localhost:3000`
3. **API calls** from frontend use `/api` (relative URL)
4. **Proxy** in `frontend/package.json` forwards `/api/*` to `http://localhost:5001`
5. **Database** uses local MongoDB

### Start Development
```bash
# Option 1: Manual
Terminal 1: cd backend && npm run dev
Terminal 2: cd frontend && npm start

# Option 2: Using deploy script
./deploy.sh
# Select option 1
```

## 🚀 Production Configuration

### Backend (.env.production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_ENV=production
```

### How It Works (Production)
1. **Backend** deployed as Vercel Serverless Functions
2. **Frontend** deployed as static site on Vercel
3. **API calls** use absolute URL to backend
4. **No proxy** needed (direct API calls)
5. **Database** uses MongoDB Atlas (cloud)

### Deploy to Production
```bash
# Option 1: Using deploy script
./deploy.sh
# Select option 4 (deploy both)

# Option 2: Manual via Vercel CLI
cd backend && vercel --prod
cd frontend && vercel --prod

# Option 3: Via Vercel Dashboard
# Push to GitHub and connect repository
```

## 🔄 Key Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| **Backend URL** | `http://localhost:5001` | `https://*.vercel.app` |
| **Frontend URL** | `http://localhost:3000` | `https://*.vercel.app` |
| **API Base Path** | `/api` (relative) | Full URL with domain |
| **Proxy** | Yes (package.json) | No |
| **Database** | Local MongoDB | MongoDB Atlas |
| **CORS** | `localhost:3000` | Vercel domain |
| **Environment** | `.env` file | Vercel dashboard |
| **Hot Reload** | Yes | No |
| **Build Process** | On-the-fly | Pre-built |

## 🔐 Environment Variable Security

### ✅ Committed to Git
- `.env.example` - Template with no real values
- `.env.development` - Safe local values
- `.env.production` - Template (no real credentials)

### ❌ Never Commit
- `.env` - Current environment (in use)
- `.env.local` - Local overrides
- `.env.production.local` - Real production credentials

### 🔒 Setting Production Variables
**Never put real credentials in `.env.production` in Git!**

Instead, set them in Vercel Dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add each variable with value
4. Select environment (Production/Preview/Development)

## 🧪 Testing Production Build Locally

You can test the production build on your local machine:

```bash
# Build frontend for production
cd frontend
npm run build:prod

# Serve the production build
npx serve -s build

# Test with production API
# (Make sure backend is running or point to Vercel backend)
```

## 🔀 Switching Environments

### Switch to Development
```bash
cd backend
cp .env.development .env

cd ../frontend
# .env.development is automatically used by react-scripts start
npm start
```

### Build for Production
```bash
cd frontend
npm run build:prod
# Uses .env.production automatically
```

## 📝 Vercel Configuration Files

### backend/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

This tells Vercel:
- Entry point is `server.js`
- Use Node.js runtime
- Route all requests to the server

### frontend/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This tells Vercel:
- Build using `npm run build`
- Output directory is `build`
- Serve static files
- All routes go to index.html (SPA routing)

## 🐛 Troubleshooting

### Issue: "API calls fail in production"
**Cause**: REACT_APP_API_URL not set correctly
**Fix**: Set full backend URL in Vercel environment variables

### Issue: "CORS error in production"
**Cause**: FRONTEND_URL not updated in backend
**Fix**: Update backend environment variable with actual frontend URL

### Issue: "Database connection failed"
**Cause**: MongoDB Atlas not configured or IP not whitelisted
**Fix**: Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access

### Issue: "Environment variables not loading"
**Cause**: Variables not set in Vercel dashboard
**Fix**: Go to project settings → Environment Variables

### Issue: "Changes not reflecting"
**Cause**: Using old deployment
**Fix**: Trigger new deployment in Vercel or push to Git

## 📚 Related Documentation

- `VERCEL_DEPLOYMENT.md` - Complete Vercel deployment guide
- `ENV_QUICK_REFERENCE.md` - Quick reference for environments
- `QUICKSTART.md` - Getting started guide
- `README.md` - Project overview

## 🎯 Best Practices

1. **Never commit** `.env` with real credentials
2. **Always test** production build locally before deploying
3. **Use separate** MongoDB databases for dev and prod
4. **Set up** continuous deployment from Git
5. **Monitor** Vercel function logs for errors
6. **Keep** environment templates updated
7. **Document** any new environment variables
8. **Rotate** production credentials periodically

## ✨ Quick Commands Reference

```bash
# Development
npm run dev              # Backend dev server
npm start                # Frontend dev server

# Production Build
npm run build:prod       # Frontend production build
npm run prod             # Backend in production mode

# Deployment
./deploy.sh              # Interactive deployment tool
vercel --prod            # Deploy to Vercel production
vercel                   # Deploy to Vercel preview

# Environment
vercel env ls            # List Vercel environment variables
vercel env add KEY       # Add environment variable
vercel env rm KEY        # Remove environment variable
```
