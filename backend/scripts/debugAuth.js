#!/usr/bin/env node

/**
 * Authentication Debug Script
 * 
 * This script helps debug authentication issues by:
 * 1. Testing database connection
 * 2. Checking user creation
 * 3. Testing login flow
 * 4. Verifying JWT token generation
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log(`${colors.cyan}=== Authentication Debug Tool ===${colors.reset}\n`);

// 1. Test Database Connection
async function testDatabaseConnection() {
  console.log(`${colors.blue}1. Testing Database Connection...${colors.reset}`);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .limit(1);
    
    if (error) {
      console.log(`${colors.red}   ❌ Database connection failed:${colors.reset}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      return false;
    }
    
    console.log(`${colors.green}   ✅ Database connection successful!${colors.reset}`);
    console.log(`   Found ${data.length} users in database`);
    return true;
  } catch (err) {
    console.log(`${colors.red}   ❌ Unexpected error:${colors.reset}`, err.message);
    return false;
  }
}

// 2. Check if users table exists and has data
async function checkUsersTable() {
  console.log(`\n${colors.blue}2. Checking Users Table...${colors.reset}`);
  
  try {
    // Check table structure
    const { data: columns, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'users' })
      .catch(() => ({ data: null }));
    
    if (tableError) {
      console.log(`${colors.yellow}   ⚠️  Could check table columns (may need to run schema.sql)${colors.reset}`);
    }
    
    // Check existing users
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, is_approved, role_id, created_at')
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.log(`${colors.red}   ❌ Error accessing users table:${colors.reset}`);
      console.log(`   Error: ${userError.message}`);
      return false;
    }
    
    console.log(`${colors.green}   ✅ Users table accessible!${colors.reset}`);
    console.log(`   Total users: ${users.length}`);
    
    if (users.length > 0) {
      console.log(`   Recent users:`);
      users.slice(-3).forEach(user => {
        console.log(`   - ${user.email} (approved: ${user.is_approved}, role: ${user.role_id})`);
      });
    }
    
    return users;
  } catch (err) {
    console.log(`${colors.red}   ❌ Unexpected error:${colors.reset}`, err.message);
    return false;
  }
}

// 3. Test User Creation
async function testUserCreation() {
  console.log(`\n${colors.blue}3. Testing User Creation...${colors.reset}`);
  
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Test1234!';
    
    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(testPassword, saltRounds);
    
    // Check if roles table exists
    const { data: roles, error: roleError } = await supabase
      .from('roles')
      .select('id, name')
      .eq('name', 'visitor');
    
    if (roleError || !roles || roles.length === 0) {
      console.log(`${colors.red}   ❌ Visitor role not found. Please run schema.sql${colors.reset}`);
      return false;
    }
    
    const visitorRoleId = roles[0].id;
    
    // Create test user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        password_hash,
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890',
        role_id: visitorRoleId,
        is_approved: false,
        is_active: true
      })
      .select()
      .single();
    
    if (createError) {
      console.log(`${colors.red}   ❌ User creation failed:${colors.reset}`);
      console.log(`   Error: ${createError.message}`);
      return false;
    }
    
    console.log(`${colors.green}   ✅ Test user created successfully!${colors.reset}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   User ID: ${newUser.id}`);
    console.log(`   Role ID: ${newUser.role_id}`);
    
    return newUser;
  } catch (err) {
    console.log(`${colors.red}   ❌ Unexpected error:${colors.reset}`, err.message);
    return false;
  }
}

// 4. Test JWT Token Generation
async function testJWTGeneration(userId) {
  console.log(`\n${colors.blue}4. Testing JWT Token Generation...${colors.reset}`);
  
  try {
    const jwtSecret = process.env.JWT_SECRET_KEY;
    
    if (!jwtSecret) {
      console.log(`${colors.red}   ❌ JWT_SECRET_KEY not found in environment variables${colors.reset}`);
      return false;
    }
    
    const token = jwt.sign({ userId }, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    
    console.log(`${colors.green}   ✅ JWT token generated successfully!${colors.reset}`);
    console.log(`   Token length: ${token.length} characters`);
    console.log(`   First 50 chars: ${token.substring(0, 50)}...`);
    
    // Test token verification
    const decoded = jwt.verify(token, jwtSecret);
    console.log(`${colors.green}   ✅ Token verification successful!${colors.reset}`);
    console.log(`   Decoded userId: ${decoded.userId}`);
    
    return token;
  } catch (err) {
    console.log(`${colors.red}   ❌ JWT generation/verification failed:${colors.reset}`, err.message);
    return false;
  }
}

// 5. Test Login Flow
async function testLoginFlow() {
  console.log(`\n${colors.blue}5. Testing Login Flow...${colors.reset}`);
  
  try {
    const testEmail = 'test@example.com';
    const testPassword = 'Test1234!';
    
    // Find user by email
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (findError || !user) {
      console.log(`${colors.red}   ❌ User not found:${colors.reset}`, findError?.message || 'User not found');
      return false;
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(testPassword, user.password_hash);
    
    if (!passwordMatch) {
      console.log(`${colors.red}   ❌ Password verification failed${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.green}   ✅ Login flow test successful!${colors.reset}`);
    console.log(`   User found and password verified`);
    console.log(`   User approved: ${user.is_approved}`);
    console.log(`   User active: ${user.is_active}`);
    
    return user;
  } catch (err) {
    console.log(`${colors.red}   ❌ Login flow test failed:${colors.reset}`, err.message);
    return false;
  }
}

// 6. Check API Configuration
function checkAPIConfig() {
  console.log(`\n${colors.blue}6. Checking API Configuration...${colors.reset}`);
  
  const requiredVars = [
    'SUPABASE_PROJECT_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'JWT_SECRET_KEY'
  ];
  
  let allGood = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      console.log(`${colors.red}   ❌ Missing: ${varName}${colors.reset}`);
      allGood = false;
    } else {
      console.log(`${colors.green}   ✅ ${varName}: ${value.substring(0, 20)}...${colors.reset}`);
    }
  });
  
  return allGood;
}

// Main debug function
async function runDebugTests() {
  console.log(`${colors.yellow}Environment Variables:${colors.reset}`);
  console.log(`   SUPABASE_PROJECT_URL: ${process.env.SUPABASE_PROJECT_URL?.substring(0, 50)}...`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50)}...`);
  console.log(`   JWT_SECRET_KEY: ${process.env.JWT_SECRET_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  
  // Run all tests
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log(`\n${colors.red}❌ Database connection failed. Please check your Supabase configuration.${colors.reset}`);
    return;
  }
  
  const users = await checkUsersTable();
  if (!users) {
    console.log(`\n${colors.red}❌ Users table not accessible. Please run schema.sql${colors.reset}`);
    return;
  }
  
  const configGood = checkAPIConfig();
  if (!configGood) {
    console.log(`\n${colors.red}❌ API configuration incomplete. Please check your .env file.${colors.reset}`);
    return;
  }
  
  const testUser = await testUserCreation();
  if (testUser) {
    await testJWTGeneration(testUser.id);
    await testLoginFlow();
  }
  
  console.log(`\n${colors.cyan}=== Debug Complete ===${colors.reset}`);
  console.log(`\n${colors.yellow}If tests passed, check:${colors.reset}`);
  console.log(`1. Backend server is running (npm start)`);
  console.log(`2. Frontend API URL is correct`);
  console.log(`3. CORS is properly configured`);
  console.log(`4. Browser network tab for API errors`);
}

// Run if called directly
if (require.main === module) {
  runDebugTests().catch(console.error);
}

module.exports = { runDebugTests };
