# 🚀 Railway Backend Deployment - Quick Guide

## 📋 সহজ স্টেপস (Simple Steps)

### ১. Railway CLI ইনস্টল করুন
```bash
# Option 1: npm দিয়ে (যদি npm কাজ করে)
npm install -g @railway/cli

# Option 2: ওয়েবসাইট থেকে ডাউনলোড করুন
# যাও: https://railway.app/download
# ডাউনলোড করে unzip করুন
```

### ২. Railway এ লগইন করুন
```bash
railway login
# Browser এ খুলে GitHub দিয়ে login করুন
```

### ৩. Backend ফোল্ডারে যান
```bash
cd "e:\WInd_Surf_Project\BILBILASH SECONDARY SCHOOL ALUMNI ASSOCIATION\backend"
```

### ৪. Railway প্রজেক্ট তৈরি করুন
```bash
railway init
# প্রজেক্টের নাম দিন: bilbilash-alumni-api
```

### ৫. Environment Variables সেট করুন
```bash
# আপনার Supabase ডাটা দিয়ে replace করুন
railway variables set JWT_SECRET_KEY=your-super-secret-jwt-key
railway variables set SUPABASE_PROJECT_URL=https://your-project.supabase.co
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
railway variables set SUPABASE_ANON_KEY=your-anon-key
railway variables set SESSION_SECRET_KEY=your-session-secret
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
railway variables set NODE_ENV=production
railway variables set PORT=5000
```

### ৬. Railway এ Deploy করুন
```bash
railway up
# অথবা
railway deploy
```

## 🔧 কি কি হবে:

### ✅ **Railway আপনার কি করবে:**
- Backend code upload করবে
- Dependencies install করবে
- Server start করবে
- Public URL দেবে
- Environment variables সেট করবে

### 🌐 **আপনি পাবেন:**
- **API URL**: https://your-app-name.up.railway.app
- **Health Check**: https://your-app-name.up.railway.app/api/health
- **Logs**: Railway dashboard এ দেখতে পারবেন

## 📊 **Free Tier লিমিট:**
- **500 hours/month** (প্রায় 30 মিনিট পর sleep)
- **1GB RAM**
- **1GB Storage**
- **100GB Bandwidth**

## 🚨 **যদি Error হয়:**

### Build ফেইল হলে:
```bash
# Logs দেখুন
railway logs

# Package.json চেক করুন
cat package.json
```

### Database connection ফেইল হলে:
```bash
# Environment variables চেক করুন
railway variables list

# Health check করুন
curl https://your-app-name.up.railway.app/api/health
```

## 🎯 **Success চেক:**

### Deploy হয়ে গেলে:
1. **Health endpoint** test করুন:
   ```bash
   curl https://your-app-name.up.railway.app/api/health
   ```

2. **Frontend connect** test করুন:
   - Frontend এ API URL update করুন
   - Login/signup test করুন

3. **Database** test করুন:
   - New user registration test করুন
   - Database এ user আসছে কিনা চেক করুন

## 📱 **Mobile App থেকে Deploy:**

### ১. Railway ওয়েবসাইট খুনুন
- যাও: https://railway.app

### ২. New Project করুন
- "New Project" এ ক্লিক করুন
- GitHub repository connect করুন

### ৩. Environment Variables সেট করুন
- Railway dashboard এ Variables tab এ যান
- উপরের variables গুলো add করুন

### ৪. Deploy করুন
- "Deploy" বাটনে ক্লিক করুন
- Automatic deploy হবে

## 🎉 **Complete হলে:**

আপনার Bilbilash Alumni Association backend Railway এ চলে যাবে!

**Next Steps:**
1. Frontend এ API URL update করুন
2. Frontend Vercel এ deploy করুন
3. Full application test করুন

**আপনার web app live!** 🚀
