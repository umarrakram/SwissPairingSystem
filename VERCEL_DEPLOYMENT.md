# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend to Vercel with separate development and production configurations.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) for production database
3. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
4. **Vercel CLI** (optional): `npm install -g vercel`

## Architecture Overview

- **Frontend**: React app deployed to Vercel (Static Site)
- **Backend**: Node.js API deployed to Vercel (Serverless Functions)
- **Database**: MongoDB Atlas (Cloud Database)

## Step 1: Set Up MongoDB Atlas

1. **Create a Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster (Free M0 tier is sufficient for testing)
   - Choose a cloud provider and region

2. **Configure Database Access**:
   - Go to "Database Access"
   - Add a new database user with username and password
   - **Save these credentials!**

3. **Configure Network Access**:
   - Go to "Network Access"
   - Add IP address `0.0.0.0/0` (Allow access from anywhere - required for Vercel)
   - Click "Confirm"

4. **Get Connection String**:
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Import Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will detect it's a monorepo

2. **Configure Backend Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty or use `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Click "Environment Variables"
   - Add the following variables:
   
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority
   FRONTEND_URL = https://your-frontend-domain.vercel.app
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://your-backend-xyz.vercel.app`)

### Option B: Using Vercel CLI

```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add MONGODB_URI production
vercel env add NODE_ENV production
vercel env add FRONTEND_URL production
```

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Import Project** (if not already done):
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository

2. **Configure Frontend Project**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or `npm run vercel-build`)
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   - Click "Environment Variables"
   - Add the following:
   
   ```
   REACT_APP_API_URL = https://your-backend-xyz.vercel.app/api
   REACT_APP_ENV = production
   ```
   
   **Important**: Use the backend URL from Step 2!

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be available at `https://your-frontend-xyz.vercel.app`

### Option B: Using Vercel CLI

```bash
# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod

# Set environment variables
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_ENV production
```

## Step 4: Update CORS Configuration

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable:

1. Go to your backend project in Vercel Dashboard
2. Go to "Settings" → "Environment Variables"
3. Update `FRONTEND_URL` to your actual frontend URL: `https://your-frontend-xyz.vercel.app`
4. Redeploy the backend (trigger a new deployment)

## Step 5: Test Your Deployment

1. Visit your frontend URL: `https://your-frontend-xyz.vercel.app`
2. Try creating a tournament
3. Check if data persists in MongoDB Atlas

## Development vs Production

### Development (Local)

**Backend**:
```bash
cd backend
npm run dev
# Uses .env.development
# MongoDB: localhost
# Port: 5001
```

**Frontend**:
```bash
cd frontend
npm start
# Uses .env.development
# API URL: /api (proxied to localhost:5001)
# Port: 3000
```

### Production (Vercel)

**Backend**:
- Environment: `.env.production` values set in Vercel dashboard
- MongoDB: Atlas connection string
- URL: `https://your-backend-xyz.vercel.app`

**Frontend**:
- Environment: `.env.production` values set in Vercel dashboard
- API URL: `https://your-backend-xyz.vercel.app/api`
- URL: `https://your-frontend-xyz.vercel.app`

## Environment Variables Summary

### Backend (.env)

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | `development` | `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/swiss-pairing` | MongoDB Atlas connection string |
| `FRONTEND_URL` | `http://localhost:3000` | `https://your-frontend-xyz.vercel.app` |
| `PORT` | `5001` | (Not needed on Vercel) |

### Frontend (.env)

| Variable | Development | Production |
|----------|-------------|------------|
| `REACT_APP_API_URL` | `/api` | `https://your-backend-xyz.vercel.app/api` |
| `REACT_APP_ENV` | `development` | `production` |

## Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your frontend URL
- Check that CORS is properly configured in `server.js`

### API Connection Errors
- Verify `REACT_APP_API_URL` points to your backend URL
- Check backend logs in Vercel dashboard

### Database Connection Errors
- Verify MongoDB Atlas connection string is correct
- Ensure IP address `0.0.0.0/0` is whitelisted
- Check database user permissions

### Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

You can configure branch deployments in Vercel project settings.

## Custom Domain (Optional)

1. Go to your project in Vercel
2. Go to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update environment variables with new domain

## Monitoring

- **Vercel Dashboard**: Monitor deployments, functions, and analytics
- **MongoDB Atlas**: Monitor database usage and performance
- **Vercel Analytics**: Add `@vercel/analytics` to your React app

## Useful Commands

```bash
# Local development
npm run dev              # Backend with nodemon
npm start                # Frontend with hot reload

# Production build (test locally)
npm run prod             # Backend in production mode
npm run build:prod       # Frontend production build

# Vercel CLI
vercel                   # Deploy preview
vercel --prod            # Deploy production
vercel logs             # View function logs
vercel env ls           # List environment variables
```

## Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use strong passwords** for MongoDB Atlas
3. **Rotate credentials** periodically
4. **Enable MongoDB backup** in Atlas
5. **Monitor usage** to detect anomalies
6. **Use environment-specific** configurations

## Cost Considerations

### Free Tier Limits:
- **Vercel**: 
  - 100GB bandwidth/month
  - 100 hours serverless function execution/month
  - Unlimited static deployments
  
- **MongoDB Atlas**: 
  - M0 (Free): 512MB storage
  - Shared resources
  - Good for development and small apps

For production at scale, consider upgrading to paid tiers.

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Deploy frontend to Vercel
3. ✅ Test all features
4. 🔄 Add Firebase Authentication (upcoming)
5. 📊 Set up monitoring and analytics
6. 🎨 Add custom domain (optional)

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Review this guide's troubleshooting section
4. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
