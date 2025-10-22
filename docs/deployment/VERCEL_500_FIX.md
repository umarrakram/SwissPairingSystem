# 🔥 Vercel 500 Error - Troubleshooting Guide

## Problem: "Failed to load resource: 500 (Internal Server Error)"

This means your backend is deployed but can't connect to MongoDB Atlas or has a configuration issue.

## 🎯 Quick Fixes (In Order)

### Fix 1: URL Encode MongoDB Password ⭐ MOST LIKELY ISSUE

### 🔍 Root Cause

Your password contains `@` which breaks the connection string!

**Current (BROKEN):**
```
mongodb+srv://USERNAME:PASS@WORD@cluster0.xxxxx.mongodb.net/...
                          ↑ This @ breaks the URL!
```

**Fixed (URL Encoded):**
```
mongodb+srv://USERNAME:PASS%40WORD@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
                          ↑ @ becomes %40
```

**How to Fix:**
1. Go to Vercel Dashboard → Your Backend Project
2. Settings → Environment Variables
3. Find `MONGODB_URI`
4. Replace with:
```
mongodb+srv://USERNAME:PASSWORD%40ENCODED@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
```
5. Redeploy: Deployments → Click "..." → Redeploy

---

### Fix 2: Check MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Select **"Allow Access From Anywhere"**
5. IP: `0.0.0.0/0`
6. Click **"Confirm"**
7. Wait 2-3 minutes for changes to take effect

---

### Fix 3: Verify Environment Variables in Vercel

Go to Vercel Dashboard → Backend Project → Settings → Environment Variables

**Required variables:**
```
NODE_ENV = production
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL = https://your-frontend.vercel.app
```

Make sure:
- ✅ No extra spaces
- ✅ Password is URL encoded (%40 instead of @)
- ✅ All variables are set for "Production" environment
- ✅ Database name `swiss-pairing` is included

---

### Fix 4: Check Backend Logs

1. Go to Vercel Dashboard → Your Backend Project
2. Click **"Deployments"**
3. Click on latest deployment
4. Click **"Functions"** or **"Logs"**
5. Look for error messages like:
   - `MongoDB connection error`
   - `Authentication failed`
   - `ECONNREFUSED`

**Common Error Messages:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Authentication failed` | Wrong password or not URL encoded | Use `%40` instead of `@` |
| `Network timeout` | IP not whitelisted | Add `0.0.0.0/0` to Network Access |
| `ENOTFOUND` | Wrong cluster URL | Check cluster address |
| `Database not found` | Missing database name | Add `/swiss-pairing` to URL |

---

### Fix 5: Test Backend Directly

Open this URL in your browser (replace with your actual backend URL):
```
https://your-backend.vercel.app/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"Server is running"}
```

Then test tournaments endpoint:
```
https://your-backend.vercel.app/api/tournaments
```

**Expected Response:**
- `[]` (empty array) - ✅ Working!
- `500 error` - ❌ Database connection issue
- `CORS error` - ❌ FRONTEND_URL not set correctly

---

## 🔍 Step-by-Step Debugging

### Step 1: Verify Connection String Format

Your connection string should look EXACTLY like this:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority&appName=Cluster0
```

**Parts breakdown:**
- `USERNAME`: Your MongoDB username
- `PASSWORD`: Your password URL encoded (@ becomes %40)
- `CLUSTER`: Your cluster address
- `DATABASE`: swiss-pairing

**Full working string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Verify MongoDB Atlas User

1. Go to MongoDB Atlas → Database Access
2. Find your database user
3. Check:
   - ✅ Password is correct
   - ✅ User has "Read and write to any database" role
   - ✅ User is enabled

### Step 3: Re-create Database User (If Needed)

If issues persist, create a new user with a simple password:

1. MongoDB Atlas → Database Access
2. Click "Add New Database User"
3. Username: `yourusername`
4. Password: `SimplePass123` (no special characters!)
5. Role: "Atlas Admin" or "Read and write to any database"
6. Add User

Then update Vercel environment variable:
```
MONGODB_URI=mongodb+srv://yourusername:SimplePass123@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🚀 Quick Fix Summary

**Do this NOW:**

1. **URL Encode Password**
   - Change: `PASS@WORD`
   - To: `PASS%40WORD`

2. **Update Vercel**
   - Go to backend project settings
   - Update `MONGODB_URI` with encoded password
   - Redeploy

3. **Whitelist IPs**
   - MongoDB Atlas → Network Access
   - Add `0.0.0.0/0`
   - Wait 2-3 minutes

4. **Test**
   - Visit: `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"OK"}`

---

## 📝 Updated Configuration Files

Update your local `.env.production` for reference:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=https://your-frontend.vercel.app
```

**Note:** Don't commit this to Git! This is just for your reference.

---

## ✅ After Fixing

Once you've made the changes:

1. ✅ Redeploy backend in Vercel
2. ✅ Wait for deployment to complete (~1 minute)
3. ✅ Test `/api/health` endpoint
4. ✅ Test `/api/tournaments` endpoint
5. ✅ Refresh your frontend
6. ✅ Should now load tournaments!

---

## 🆘 Still Not Working?

### Check Frontend Environment Variable

1. Go to Vercel Dashboard → **Frontend** Project
2. Settings → Environment Variables
3. Verify `REACT_APP_API_URL` is correct:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```
**Important:** Must include `/api` at the end!

### Check CORS

1. Open browser console (F12)
2. Look for CORS errors
3. If you see CORS errors:
   - Go to backend project → Environment Variables
   - Update `FRONTEND_URL` to match your actual frontend URL
   - Redeploy backend

---

## 💡 Pro Tips

1. **Always URL encode passwords** with special characters
2. **Special characters to encode:**
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`

3. **Use simple passwords** for easier debugging

4. **Test locally first** before deploying

5. **Check Vercel function logs** for detailed errors

---

## 📞 Quick Links

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **URL Encoder Tool**: https://www.urlencoder.org/

---

## ⚡ TL;DR

**Most likely issue:** Password has `@` symbol that breaks the URL.

**Quick fix:**
1. Replace `@` with `%40` in password
2. Update `MONGODB_URI` in Vercel backend settings
3. Redeploy

**Your fixed connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/swiss-pairing?retryWrites=true&w=majority&appName=Cluster0
```
Replace `username`, `password`, and `cluster0.xxxxx` with your actual MongoDB Atlas credentials.

---

**After fixing, your app should work!** 🎉
