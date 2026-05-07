require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Check Node.js version for fetch API compatibility
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

if (majorVersion < 18) {
  console.warn('⚠️  Warning: Node.js version ' + nodeVersion + ' detected.');
  console.warn('⚠️  Supabase client may not work correctly without native fetch API.');
  console.warn('⚠️  Recommended: Node.js 18 or higher.');
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let connectionError = null;

// Initialize Supabase client (with error handling)
try {
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL or SUPABASE_PROJECT_URL is missing from environment variables.');
  }
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY is missing from environment variables.');
  }

  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log('✅ Supabase client initialized');
} catch (error) {
  connectionError = error;
  console.error('❌ Failed to initialize Supabase client:', error.message);
  console.error('❌ The server will start in degraded mode (database operations will fail)');
}

// Database connection test (optional - doesn't crash server)
const testConnection = async () => {
  if (!supabase) {
    console.warn('⚠️  Skipping database connection test - Supabase client not initialized');
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }

    console.log('✅ Database connection test passed');
    return true;
  } catch (error) {
    console.error('❌ Database connection test error:', error.message);
    return false;
  }
};

// Get Supabase client (returns null if not initialized)
const getSupabaseClient = () => {
  if (!supabase) {
    console.warn('⚠️  Supabase client not available - check environment variables');
  }
  return supabase;
};

module.exports = {
  supabase,
  getSupabaseClient,
  testConnection,
  isInitialized: !!supabase,
  connectionError
};