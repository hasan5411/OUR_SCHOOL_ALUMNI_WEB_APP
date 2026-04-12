# Bilbilash Secondary School Alumni Association

A comprehensive alumni association web application built with React.js frontend and Node.js/Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your Supabase credentials:
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRE=7d
# SUPABASE_URL=your-supabase-url
# SUPABASE_ANON_KEY=your-supabase-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Run database setup
# 1. Run the SQL in backend/schema.sql in Supabase SQL Editor
# 2. Run the SQL in backend/config/functions.sql in Supabase SQL Editor
# 3. Run the SQL in backend/config/additionalFunctions.sql in Supabase SQL Editor

# Seed the database (creates authority account)
npm run seed

# Start backend server
npm start
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend development server
npm start
```

## 🌐 Access Points

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📋 Testing the Application

### 1. Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","timestamp":"2024-04-10T...","environment":"development"}
```

### 2. Test Authentication

**Register New User:**
1. Visit http://localhost:3000/register
2. Fill out registration form
3. Submit - should show success message
4. Check database for new user (status: pending_approval)

**Login:**
1. Visit http://localhost:3000/login
2. Use authority account credentials (from seed script)
3. Should redirect to authority dashboard

### 3. Test Role-Based Access

**Authority Account:**
- Email: `authority@bilbilash.edu`
- Password: `authority123`
- Access: All features (super admin)

**Admin Account:**
- Need to be promoted by authority
- Access: User management, approvals, basic admin features

**Member Account:**
- Regular registered users
- Access: Profile, job applications, help requests

**Visitor Account:**
- Unapproved users
- Limited access until approved

### 4. Test Key Features

**User Management:**
1. Register new user → Status: pending
2. Authority approves → Status: approved
3. User can now access all features

**Job Board:**
1. Member creates job post → Status: pending_approval
2. Admin approves → Job becomes visible
3. Members can apply with CV upload

**Payment Tracking:**
1. Create payment → bKash/Nagad options
2. Admin verifies → Status: completed
3. Members see only their payments

**Vision Ideas:**
1. Member submits vision → Status: proposed
2. Admin approves → Status: approved
3. Community can vote/support

**Help Requests:**
1. Member creates help request → Status: pending
2. Admin verifies → Status: verified
3. Community can support

## 🔧 Development Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run seed       # Seed database with authority account
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🗂️ Project Structure

```
├── backend/
│   ├── controllers/     # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Authentication & validation
│   ├── config/         # Database & app configuration
│   ├── scripts/        # Database seeding
│   └── schema.sql      # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── contexts/     # React contexts
│   │   └── App.js        # Main app component
│   └── public/          # Static files
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Admin limit enforcement (max 100 admins)
- Authority account protection
- File upload validation
- SQL injection prevention
- XSS protection

## 📊 Database Schema

Key Tables:
- `users` - User accounts and profiles
- `roles` - User roles (visitor, member, admin, authority)
- `job_posts` - Job board listings
- `job_applications` - Job applications with CVs
- `vision_ideas` - Community vision proposals
- `help_requests` - Help and support requests
- `payments` - Payment tracking (bKash, Nagad)

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

**Database connection errors:**
1. Verify Supabase credentials in .env
2. Check if schema is imported correctly
3. Ensure RLS policies are set up

**Frontend API errors:**
1. Check if backend is running on port 5000
2. Verify REACT_APP_API_URL in frontend/.env
3. Check browser console for CORS errors

**Authentication issues:**
1. Clear browser localStorage
2. Check JWT_SECRET in backend/.env
3. Verify user approval status

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Database connection
# Check backend console for "Database connected successfully"
```

## 🚀 Deployment

### Backend (Production)
```bash
cd backend
npm install --production
npm start
```

### Frontend (Production)
```bash
cd frontend
npm run build
# Serve the build/ folder with nginx or similar
```

## 📝️ Environment Variables

### Backend (.env)
```
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and support:
1. Check this README first
2. Review troubleshooting section
3. Check browser console for errors
4. Verify backend logs
5. Contact development team

## 📄 License

This project is licensed under the MIT License.
