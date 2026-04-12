const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database connection test
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) throw error;
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message || error);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
