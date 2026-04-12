# 🧪 Testing Guide for Bilbilash Alumni Association

## Quick Verification Steps

### 1. Backend Health Check
```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Expected response:
{"status":"OK","timestamp":"2024-04-10T...","environment":"development"}
```

### 2. Frontend Access
- Open browser: http://localhost:3000
- Should see homepage with "Bilbilash Alumni Association"
- Check browser console for errors

### 3. Authentication Testing

#### Register New User
1. Go to http://localhost:3000/register
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: 1234567890
   - Password: Test1234
   - Confirm Password: Test1234
3. Submit
4. Should see success message and redirect to login

#### Login with Authority Account
1. Go to http://localhost:3000/login
2. Use credentials:
   - Email: authority@bilbilash.edu
   - Password: authority123
3. Should redirect to Authority Dashboard

### 4. Role-Based Access Testing

#### Test Authority Features
1. Login as authority
2. Navigate to Authority Dashboard
3. Check for:
   - User management section
   - Admin capacity indicator
   - System controls
   - Critical alerts section

#### Test Admin Features
1. Authority promotes a user to admin
2. Login as admin
3. Navigate to Admin Dashboard
4. Check for:
   - Pending user approvals
   - User statistics
   - Quick actions panel

#### Test Member Features
1. Register new account (wait for approval)
2. Authority approves the account
3. Login as member
4. Navigate to Member Dashboard
5. Check for:
   - Profile section
   - Job applications
   - Help requests

### 5. Module Testing Checklist

#### ✅ Authentication Module
- [ ] User registration works
- [ ] Email validation works
- [ ] Password validation works
- [ ] Login works
- [ ] Logout works
- [ ] Token storage works
- [ ] Protected routes work
- [ ] Role-based access works

#### ✅ User Profile Module
- [ ] Profile view works
- [ ] Profile update works
- [ ] Profile image upload works
- [ ] Alumni search works
- [ ] Role-based access control works

#### ✅ Job Board Module
- [ ] Job creation works (member)
- [ ] Job approval works (admin)
- [ ] Job listing works (public)
- [ ] Job application works
- [ ] CV upload works
- [ ] Application management works

#### ✅ Vision Ideas Module
- [ ] Vision creation works (member)
- [ ] Vision approval works (admin)
- [ ] Vision listing works (public)
- [ ] Voting system works
- [ ] Progress tracking works

#### ✅ Help Requests Module
- [ ] Help request creation works (member)
- [ ] Help request verification works (admin)
- [ ] Help request listing works (public)
- [ ] Support system works
- [ ] Resolution tracking works

#### ✅ Payment Tracking Module
- [ ] Payment creation works
- [ ] bKash integration works
- [ ] Nagad integration works
- [ ] Payment verification works (admin)
- [ ] Payment history works (member)

#### ✅ Role Management Module
- [ ] User approval works (admin)
- [ ] User rejection works (admin)
- [ ] Admin promotion works (authority)
- [ ] Admin demotion works (authority)
- [ ] Admin limit enforcement works

### 6. Database Verification

#### Check Tables in Supabase
```sql
-- Verify users table
SELECT COUNT(*) FROM users;
-- Should have at least 1 authority account

-- Verify roles table
SELECT * FROM roles;
-- Should have: visitor, member, admin, authority

-- Check recent registrations
SELECT email, is_approved, created_at FROM users ORDER BY created_at DESC LIMIT 5;
```

### 7. Common Issues & Solutions

#### CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Check backend CORS configuration and frontend API URL

#### Authentication Failures
**Problem**: Login always fails
**Solution**: 
1. Check JWT_SECRET in backend/.env
2. Verify database connection
3. Check user approval status

#### File Upload Issues
**Problem**: CV or image upload fails
**Solution**:
1. Check file size limits
2. Verify file type validation
3. Check Supabase Storage configuration

#### Role Access Issues
**Problem**: Users can't access expected pages
**Solution**:
1. Check user role in database
2. Verify approval status
3. Check frontend role checking logic

### 8. Performance Testing

#### Load Testing
```bash
# Test API endpoints with multiple requests
for i in {1..10}; do
  curl -X GET http://localhost:5000/api/health &
done
```

#### Frontend Performance
- Open browser DevTools
- Check Network tab for API response times
- Check Console for JavaScript errors
- Verify memory usage

### 9. Security Testing

#### Authentication Security
- Try accessing protected routes without token
- Verify token expiration works
- Test role-based access control

#### Input Validation
- Test SQL injection attempts
- Test XSS attempts
- Verify file upload security

### 10. Mobile Responsiveness

#### Test on Different Screen Sizes
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

#### Test Mobile Features
- Touch interactions
- Mobile navigation menu
- Form usability on mobile

### 11. Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### 12. Final Verification Checklist

#### Backend ✅
- [ ] All API endpoints respond correctly
- [ ] Database operations work
- [ ] Authentication works
- [ ] File uploads work
- [ ] Error handling works
- [ ] Security measures active

#### Frontend ✅
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms validate correctly
- [ ] API integration works
- [ ] Responsive design works
- [ ] Loading states work
- [ ] Error messages display correctly

#### Integration ✅
- [ ] Frontend connects to backend
- [ ] Authentication flow works end-to-end
- [ ] Data flows correctly
- [ ] File uploads work end-to-end
- [ ] Role-based access works end-to-end

## 🚨 Troubleshooting Quick Reference

| Issue | Check | Solution |
|-------|--------|----------|
| Backend won't start | Port 5000 free? | Kill process or change port |
| Frontend won't start | Port 3000 free? | Kill process or change port |
| API calls fail | Backend running? | Start backend server |
| Login fails | Database connected? | Check credentials |
| No data showing | Tables exist? | Run schema.sql |
| CORS errors | CORS configured? | Check backend CORS settings |
| File upload fails | Storage configured? | Check Supabase Storage |

## 📞 Getting Help

If you encounter issues:
1. Check this guide first
2. Check browser console for errors
3. Check backend logs
4. Verify environment variables
5. Test with fresh database if needed

## ✅ Success Criteria

The application is working correctly when:
- All users can register and login
- Role-based access control works
- All modules function as expected
- No console errors
- Responsive design works
- Security measures are active
