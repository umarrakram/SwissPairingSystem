# Environment Configuration Quick Reference

## 🔧 Development Setup (Local)

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# Server runs on http://localhost:5001
# Uses local MongoDB on mongodb://localhost:27017
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# App runs on http://localhost:3000
# API calls proxied to http://localhost:5001
```

### Environment Files
- **Backend**: Uses `backend/.env` or `backend/.env.development`
- **Frontend**: Uses `frontend/.env.development`

---

## 🚀 Production Deployment (Vercel)

### Deploy Backend
```bash
cd backend
vercel --prod
# Set environment variables in Vercel dashboard
```

### Deploy Frontend
```bash
cd frontend
vercel --prod
# Set environment variables in Vercel dashboard
```

### Environment Variables Required

#### Backend (Vercel Dashboard)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiss-pairing
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (Vercel Dashboard)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_ENV=production
```

---

## 📋 Checklist Before Deployment

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied
- [ ] Environment variables set in Vercel
- [ ] Backend deployed successfully
- [ ] API endpoint tested

### Frontend
- [ ] Backend URL obtained from deployment
- [ ] REACT_APP_API_URL set to backend URL
- [ ] Environment variables set in Vercel
- [ ] Frontend deployed successfully
- [ ] App loads correctly
- [ ] API calls working

### Post-Deployment
- [ ] Update backend FRONTEND_URL to actual frontend URL
- [ ] Redeploy backend to apply CORS changes
- [ ] Test tournament creation
- [ ] Test all features end-to-end
- [ ] Monitor for errors in Vercel dashboard

---

## 🔑 Environment Variables Summary

| Variable | Dev Value | Prod Value |
|----------|-----------|------------|
| **Backend** | | |
| `NODE_ENV` | `development` | `production` |
| `MONGODB_URI` | `mongodb://localhost:27017/swiss-pairing` | MongoDB Atlas URL |
| `FRONTEND_URL` | `http://localhost:3000` | Vercel frontend URL |
| `PORT` | `5001` | (Auto-set by Vercel) |
| **Frontend** | | |
| `REACT_APP_API_URL` | `/api` | Vercel backend URL + `/api` |
| `REACT_APP_ENV` | `development` | `production` |

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error
**Fix**: Update `FRONTEND_URL` in backend Vercel settings to match frontend URL

### Issue: API Not Found
**Fix**: Check `REACT_APP_API_URL` includes `/api` at the end

### Issue: Database Connection Failed
**Fix**: Verify MongoDB Atlas connection string and whitelist 0.0.0.0/0

### Issue: Build Failed on Vercel
**Fix**: Check Node.js version, ensure all dependencies in package.json

---

## 📝 Quick Commands

```bash
# Kill all node processes
pkill -9 node

# Check what's using a port
lsof -ti:5001

# Test backend API
curl http://localhost:5001/api/health

# Test production API
curl https://your-backend.vercel.app/api/health

# Build frontend locally
npm run build:prod

# View Vercel logs
vercel logs --follow
```

---

## 🔗 Important URLs

### Development
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- MongoDB: mongodb://localhost:27017

### Production
- Frontend: https://your-frontend.vercel.app
- Backend API: https://your-backend.vercel.app/api
- MongoDB: mongodb+srv://cluster.mongodb.net

---

## 📚 Documentation Files

- `README.md` - Project overview and features
- `QUICKSTART.md` - Quick setup guide
- `VERCEL_DEPLOYMENT.md` - Detailed Vercel deployment steps
- `DEPLOYMENT_GUIDE.md` - General deployment guide
- `ARCHITECTURE.md` - System architecture
- `TESTING_GUIDE.md` - Testing instructions
- This file: Quick reference for environments
