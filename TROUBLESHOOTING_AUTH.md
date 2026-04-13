# 🔧 Authentication Troubleshooting Guide

## 🚨 Problem: Login/Signup Failing

Database receives requests but authentication doesn't work.

## 🔍 Step-by-Step Debugging

### 1. **Run Debug Script**
```bash
cd backend
npm run debug-auth
```

This will test:
- ✅ Database connection
- ✅ Users table access
- ✅ User creation
- ✅ JWT token generation
- ✅ Login flow
- ✅ Environment variables

### 2. **Check Environment Variables**

#### Backend (.env)
```bash
# Required variables - MUST be set:
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
JWT_SECRET_KEY=your-super-secret-jwt-key
SESSION_SECRET_KEY=your-session-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Frontend (.env.production)
```bash
# Required variables - MUST match backend:
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

### 3. **Common Issues & Solutions**

#### ❌ Issue: "Database connection failed"
**Cause**: Wrong Supabase URL or service key
**Solution**:
1. Go to Supabase dashboard
2. Copy Project URL from Settings → API
3. Copy Service Role Key from Settings → API
4. Update .env file

#### ❌ Issue: "Users table not accessible"
**Cause**: Schema not executed
**Solution**:
```bash
cd backend
npm run setup-db
```

#### ❌ Issue: "JWT_SECRET_KEY not found"
**Cause**: Environment variable not set
**Solution**:
```bash
export JWT_SECRET_KEY="your-super-secret-key"
# Or add to .env file
```

#### ❌ Issue: "CORS errors in browser"
**Cause**: Frontend URL not whitelisted
**Solution**:
1. Set FRONTEND_URL in backend .env
2. Restart backend server
3. Check CORS origin in browser console

#### ❌ Issue: "User not found" during login
**Cause**: User not created or wrong table
**Solution**:
1. Check if users table exists in Supabase
2. Run schema.sql if missing
3. Verify user email exists

#### ❌ Issue: "Password verification failed"
**Cause**: Wrong password hashing or comparison
**Solution**:
1. Check bcrypt version consistency
2. Verify password field name (password_hash)
3. Test with simple password

### 4. **Manual Testing**

#### Test Database Directly
```sql
-- In Supabase SQL Editor:
SELECT COUNT(*) FROM users;
SELECT * FROM users WHERE email = 'test@example.com';
```

#### Test API Endpoints
```bash
# Test backend health
curl https://your-backend-url.railway.app/api/health

# Test registration
curl -X POST https://your-backend-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","first_name":"Test","last_name":"User","phone":"+1234567890"}'

# Test login
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

### 5. **Frontend Debugging**

#### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try login/signup
4. Look for:
   - CORS errors
   - Network failures
   - JavaScript errors
   - Response status codes

#### Check Network Tab
1. Go to Network tab
2. Try login/signup
3. Check:
   - Request URL (should be correct)
   - Request payload
   - Response status (200, 400, 500)
   - Response body

### 6. **Database Schema Verification**

#### Required Tables
```sql
-- These tables MUST exist:
users
roles
students
job_posts
job_applications
vision_ideas
help_requests
payments
```

#### Check Table Structure
```sql
-- Users table should have:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';
```

### 7. **Production Deployment Issues**

#### Railway (Backend)
1. Check Railway logs for errors
2. Verify environment variables in Railway dashboard
3. Ensure port is correct (usually 5000)
4. Check if service is running

#### Vercel (Frontend)
1. Check Vercel build logs
2. Verify REACT_APP_API_URL is set
3. Check Functions tab for errors
4. Ensure domain is correct

### 8. **Quick Fix Checklist**

#### Backend ✅
- [ ] Environment variables set correctly
- [ ] Database schema executed
- [ ] Server starts without errors
- [ ] API endpoints respond
- [ ] CORS configured properly

#### Frontend ✅
- [ ] API URL set correctly
- [ ] No console errors
- [ ] Network requests succeed
- [ ] Authentication flow works
- [ ] Tokens stored correctly

### 9. **Emergency Reset**

If nothing works, reset everything:

#### Backend
```bash
# 1. Clear node_modules
rm -rf node_modules package-lock.json

# 2. Reinstall
npm install

# 3. Reset database
# Drop all tables in Supabase
# Run: npm run setup-db

# 4. Reset environment
# Copy from .env.example
# Set your actual values

# 5. Restart
npm start
```

#### Frontend
```bash
# 1. Clear build
rm -rf build

# 2. Reset environment
# Copy from .env.example
# Set your actual API URL

# 3. Rebuild
npm run build

# 4. Redeploy
vercel --prod
```

### 10. **Get Help**

If still failing:
1. Run debug script and share output
2. Check browser console errors
3. Check Railway/Vercel logs
4. Verify Supabase connection
5. Test with Postman/Insomnia

## 🚀 Most Common Fix

**95% of auth issues are caused by:**

1. **Wrong environment variables** - Run debug script
2. **Missing database schema** - Run `npm run setup-db`
3. **CORS configuration** - Set FRONTEND_URL
4. **Wrong API URL in frontend** - Check REACT_APP_API_URL

**Run the debug script first - it will identify most issues automatically!**
