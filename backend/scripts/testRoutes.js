#!/usr/bin/env node

/**
 * Route Testing Script
 * 
 * This script tests all API routes to identify issues
 */

require('dotenv').config();
const axios = require('axios');

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.up.railway.app/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

console.log(`${colors.cyan}=== API Route Testing ===${colors.reset}`);
console.log(`Testing API at: ${baseURL}\n`);

// Test endpoints
const endpoints = [
  { method: 'GET', path: '/health', description: 'Health Check' },
  { method: 'POST', path: '/auth/register', description: 'User Registration', data: { email: 'test@example.com', password: 'Test1234!', first_name: 'Test', last_name: 'User', phone: '+1234567890' } },
  { method: 'POST', path: '/auth/login', description: 'User Login', data: { email: 'test@example.com', password: 'Test1234!' } },
  { method: 'GET', path: '/auth/profile', description: 'Get Profile' },
  { method: 'GET', path: '/users', description: 'Get Users' },
  { method: 'GET', path: '/roles', description: 'Get Roles' },
  { method: 'GET', path: '/jobs', description: 'Get Jobs' },
  { method: 'GET', path: '/visions', description: 'Get Visions' },
  { method: 'GET', path: '/help-requests', description: 'Get Help Requests' },
  { method: 'GET', path: '/payments', description: 'Get Payments' },
];

async function testEndpoint(endpoint) {
  try {
    console.log(`${colors.blue}Testing: ${endpoint.description} (${endpoint.method} ${endpoint.path})${colors.reset}`);
    
    let response;
    if (endpoint.method === 'GET') {
      response = await api.get(endpoint.path);
    } else if (endpoint.method === 'POST') {
      response = await api.post(endpoint.path, endpoint.data);
    }
    
    console.log(`${colors.green}  ✅ Status: ${response.status}${colors.reset}`);
    if (response.status === 200 || response.status === 201) {
      console.log(`${colors.green}  ✅ Success: Route found and working${colors.reset}`);
    }
    
    return { success: true, status: response.status, data: response.data };
    
  } catch (error) {
    console.log(`${colors.red}  ❌ Error: ${error.message}${colors.reset}`);
    
    if (error.response) {
      console.log(`${colors.yellow}  Status: ${error.response.status}${colors.reset}`);
      console.log(`${colors.yellow}  Data: ${JSON.stringify(error.response.data)}${colors.reset}`);
      
      if (error.response.status === 404) {
        console.log(`${colors.red}  🚨 Route not found!${colors.reset}`);
      }
    }
    
    return { success: false, error: error.message, status: error.response?.status };
  }
}

async function runTests() {
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ ...endpoint, ...result });
    console.log(''); // Add spacing
  }
  
  // Summary
  console.log(`${colors.bright}=== Test Summary ===${colors.reset}`);
  
  const successCount = results.filter(r => r.success).length;
  const notFoundCount = results.filter(r => r.status === 404).length;
  
  console.log(`${colors.green}✅ Working routes: ${successCount}/${results.length}${colors.reset}`);
  console.log(`${colors.red}❌ Not found routes: ${notFoundCount}${colors.reset}`);
  
  if (notFoundCount > 0) {
    console.log(`\n${colors.yellow}🚨 Routes Not Found:${colors.reset}`);
    results.filter(r => r.status === 404).forEach(route => {
      console.log(`${colors.red}  - ${route.method} ${route.path} (${route.description})${colors.reset}`);
    });
    
    console.log(`\n${colors.cyan}🔧 Possible Solutions:${colors.reset}`);
    console.log(`1. Check if route files exist in backend/routes/`);
    console.log(`2. Verify routes are imported in app.js`);
    console.log(`3. Check route path prefixes in app.js`);
    console.log(`4. Ensure backend server is running`);
  }
  
  // Check specific auth routes
  console.log(`\n${colors.cyan}🔍 Auth Route Analysis:${colors.reset}`);
  const authRoutes = results.filter(r => r.path.includes('/auth'));
  authRoutes.forEach(route => {
    if (route.success) {
      console.log(`${colors.green}  ✅ ${route.method} ${route.path}${colors.reset}`);
    } else {
      console.log(`${colors.red}  ❌ ${route.method} ${route.path} - ${route.error}${colors.reset}`);
    }
  });
}

// Run tests
runTests().catch(console.error);
