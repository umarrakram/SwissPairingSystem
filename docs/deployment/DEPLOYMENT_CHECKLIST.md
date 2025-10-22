# Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## ☑️ Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Created MongoDB Atlas account
- [ ] Created a new cluster (M0 Free tier is fine)
- [ ] Created database user with username and password
- [ ] Whitelisted IP address `0.0.0.0/0` in Network Access
- [ ] Copied connection string
- [ ] Tested connection string locally

### 2. Vercel Account Setup
- [ ] Created Vercel account at [vercel.com](https://vercel.com)
- [ ] Connected GitHub/GitLab/Bitbucket account
- [ ] Installed Vercel CLI: `npm install -g vercel` (optional)

### 3. Code Preparation
- [ ] Pushed latest code to Git repository
- [ ] Verified `.gitignore` excludes `.env` files
- [ ] Verified `vercel.json` exists in both frontend and backend
- [ ] Tested application locally (dev mode)
- [ ] Tested production build locally

### 4. Environment Files Ready
- [ ] `backend/.env.development` configured for local
- [ ] `backend/.env.production` exists as template
- [ ] `frontend/.env.development` configured for local
- [ ] `frontend/.env.production` exists as template

## 🚀 Backend Deployment

### Step 1: Deploy Backend to Vercel
- [ ] Imported project in Vercel Dashboard
- [ ] Set Root Directory to `backend`
- [ ] Framework Preset: Other
- [ ] Build Command: (leave empty)

### Step 2: Configure Backend Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing`
  - Replace with your actual MongoDB Atlas connection string
- [ ] `FRONTEND_URL` = (Leave blank for now, will update after frontend deployment)

### Step 3: Deploy Backend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy backend URL (e.g., `https://backend-xyz.vercel.app`)
- [ ] Test API health endpoint: `https://backend-xyz.vercel.app/api/health`

**Backend URL:** _______________________________________________

## 🎨 Frontend Deployment

### Step 1: Deploy Frontend to Vercel
- [ ] Imported project in Vercel Dashboard (or created new project)
- [ ] Set Root Directory to `frontend`
- [ ] Framework Preset: Create React App
- [ ] Build Command: `npm run build` or `npm run vercel-build`
- [ ] Output Directory: `build`

### Step 2: Configure Frontend Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

- [ ] `REACT_APP_API_URL` = `https://your-backend-xyz.vercel.app/api`
  - Use the backend URL from above (don't forget `/api` at the end!)
- [ ] `REACT_APP_ENV` = `production`

### Step 3: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL (e.g., `https://frontend-xyz.vercel.app`)

**Frontend URL:** _______________________________________________

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Go to backend project in Vercel Dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Update `FRONTEND_URL` to your actual frontend URL
- [ ] Trigger a new deployment (Settings → Deployments → Redeploy)

### Verify Deployment
- [ ] Visit frontend URL
- [ ] Check browser console for errors
- [ ] Try to create a tournament
- [ ] Verify tournament appears in list
- [ ] Check MongoDB Atlas for new data
- [ ] Test public share link
- [ ] Test all CRUD operations

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Page loads without errors
- [ ] Create tournament form works
- [ ] Tournament list displays
- [ ] Can access tournament view
- [ ] Player management loads
- [ ] Can add individual player
- [ ] Bulk upload works
- [ ] Generate pairings works
- [ ] Update results works
- [ ] Standings calculate correctly
- [ ] Public link works

### Backend Tests
- [ ] Health endpoint responds: `/api/health`
- [ ] Can create tournament: `POST /api/tournaments`
- [ ] Can get tournaments: `GET /api/tournaments`
- [ ] Can add player: `POST /api/players`
- [ ] Can generate pairings: `POST /api/pairings/generate`
- [ ] Database updates reflect in MongoDB Atlas

### CORS Tests
- [ ] No CORS errors in browser console
- [ ] API calls succeed from frontend
- [ ] Public share link works

## 🐛 Troubleshooting

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- [ ] Verify `FRONTEND_URL` in backend matches actual frontend URL
- [ ] Check backend `server.js` has proper CORS configuration
- [ ] Redeploy backend after updating environment variables

### ❌ API Not Found (404)
**Error:** `Cannot GET /api/tournaments`

**Solution:**
- [ ] Verify `REACT_APP_API_URL` includes `/api` at the end
- [ ] Check backend `vercel.json` routing configuration
- [ ] Test backend URL directly in browser

### ❌ Database Connection Failed
**Error:** `MongoServerError: authentication failed`

**Solution:**
- [ ] Verify MongoDB Atlas connection string is correct
- [ ] Check username and password (no special characters issues)
- [ ] Ensure IP `0.0.0.0/0` is whitelisted in Network Access
- [ ] Test connection string with MongoDB Compass

### ❌ Build Failed
**Error:** Build errors in Vercel logs

**Solution:**
- [ ] Check Node.js version compatibility
- [ ] Verify all dependencies in `package.json`
- [ ] Check for environment variable issues
- [ ] Review Vercel build logs for specific errors

### ❌ Blank Page
**Error:** Frontend loads but shows blank page

**Solution:**
- [ ] Check browser console for JavaScript errors
- [ ] Verify React Router configuration
- [ ] Check `vercel.json` routing in frontend
- [ ] Test production build locally first

## 📝 Environment Variables Reference

### Backend Variables (Vercel Dashboard)

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `MONGODB_URI` | MongoDB Atlas connection string | Include database name |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Update after frontend deployment |

### Frontend Variables (Vercel Dashboard)

| Variable | Value | Notes |
|----------|-------|-------|
| `REACT_APP_API_URL` | `https://your-backend.vercel.app/api` | Must include `/api` |
| `REACT_APP_ENV` | `production` | Optional |

## 🎯 Post-Deployment Tasks

### Immediate
- [ ] Test all features end-to-end
- [ ] Share links with stakeholders
- [ ] Document actual URLs
- [ ] Set up monitoring

### Optional
- [ ] Add custom domain (Vercel Settings)
- [ ] Set up Analytics (Vercel Analytics)
- [ ] Configure Vercel integrations
- [ ] Set up automatic deployments from Git
- [ ] Add staging environment
- [ ] Configure preview deployments

### Future
- [ ] Monitor Vercel usage and billing
- [ ] Monitor MongoDB Atlas usage
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create backup strategy
- [ ] Document for team members

## 📞 Support Resources

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Project Documentation:
  - [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
  - [DEV_VS_PROD.md](./DEV_VS_PROD.md)
  - [ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md)

## ✅ Deployment Complete!

Once all items are checked:
- ✅ Backend deployed and working
- ✅ Frontend deployed and working
- ✅ CORS configured correctly
- ✅ Database connected
- ✅ All features tested
- ✅ No console errors

**Congratulations!** Your Swiss Pairing System is now live! 🎉

---

**Deployment Date:** _______________

**Deployed By:** _______________

**URLs:**
- Frontend: _______________________________________________
- Backend: _______________________________________________
- MongoDB: _______________________________________________
