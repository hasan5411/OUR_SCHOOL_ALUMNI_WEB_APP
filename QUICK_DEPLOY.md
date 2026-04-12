# 🚀 Quick Free Deployment Guide

## Fastest Way to Deploy (15 minutes)

### 1. Database (Supabase) - 5 minutes
1. Go to https://supabase.com → Create Project
2. Run these SQL files in Supabase SQL Editor:
   - `backend/schema.sql`
   - `backend/config/functions.sql`
   - `backend/config/additionalFunctions.sql`
3. Copy your Supabase URL and keys

### 2. Backend (Railway) - 5 minutes
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway variables set JWT_SECRET=your-secret-key
railway variables set SUPABASE_URL=your-supabase-url
railway variables set SUPABASE_ANON_KEY=your-anon-key
railway up
```

### 3. Frontend (Vercel) - 5 minutes
```bash
cd frontend
npm install -g vercel
vercel login
echo "REACT_APP_API_URL=https://your-backend-url.railway.app/api" > .env.production
vercel --prod
```

## 🎯 That's it! Your app is live!

### Your URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-api.railway.app
- **Database**: Supabase dashboard

### Default Login:
- **Authority**: authority@bilbilash.edu / authority123

## 📱 Test Your Live App:
1. Open frontend URL
2. Register new user
3. Authority approves user
4. Test all features

## 💰 Cost: $0/month
- Vercel: Free (100GB bandwidth)
- Railway: Free (500 hours/month)
- Supabase: Free (500MB database)

## 🔄 Auto-Deploy from GitHub:
- Connect both services to your GitHub repo
- Every push to main = automatic deployment

Done! 🎉
