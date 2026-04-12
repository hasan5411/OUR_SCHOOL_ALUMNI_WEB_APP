const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Check if Authority user already exists
    const { data: existingAuthority, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'authority@bilbilash.edu')
      .single();

    if (existingAuthority) {
      console.log('Authority user already exists. Skipping seeding.');
      return;
    }

    // Get Authority role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'authority')
      .single();

    if (roleError || !roleData) {
      throw new Error('Authority role not found. Please run the database setup script first.');
    }

    // Create Authority user
    const authorityPassword = 'Authority@2024'; // Change this in production
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(authorityPassword, saltRounds);

    const { data: authorityUser, error: userError } = await supabase
      .from('users')
      .insert({
        email: 'authority@bilbilash.edu',
        password_hash,
        first_name: 'System',
        last_name: 'Authority',
        role_id: roleData.id,
        is_approved: true,
        is_active: true
      })
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        role_id,
        is_approved,
        is_active,
        roles(name)
      `)
      .single();

    if (userError || !authorityUser) {
      throw new Error('Error creating Authority user: ' + (userError?.message || 'Unknown error'));
    }

    // Create Authority alumni profile
    const { error: profileError } = await supabase
      .from('alumni_profiles')
      .insert({
        user_id: authorityUser.id,
        graduation_year: 2020,
        stream: 'Computer Science',
        current_occupation: 'System Administrator',
        company: 'Bilbilash Secondary School',
        location: 'Bilbilash',
        bio: 'System Authority account for managing the Bilbilash Secondary School Alumni Association platform.',
        is_public: false
      });

    if (profileError) {
      console.warn('Warning: Could not create Authority alumni profile:', profileError.message);
    }

    console.log('Database seeding completed successfully!');
    console.log('Authority user created with email: authority@bilbilash.edu');
    console.log('Default password: Authority@2024');
    console.log('IMPORTANT: Change this password immediately after first login!');

  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
