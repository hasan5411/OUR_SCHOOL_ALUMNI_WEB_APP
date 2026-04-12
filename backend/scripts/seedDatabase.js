const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create roles if they don't exist
    const roles = [
      { name: 'visitor', description: 'Can view public content only' },
      { name: 'member', description: 'Approved alumni member with basic access' },
      { name: 'admin', description: 'Can manage users and content' },
      { name: 'authority', description: 'System administrator - unchangeable' }
    ];

    for (const role of roles) {
      const { data: existingRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', role.name)
        .single();

      if (!existingRole) {
        await supabase
          .from('roles')
          .insert(role);
        console.log(`Created role: ${role.name}`);
      }
    }

    // Check if Authority user already exists
    const { data: existingAuthority } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'authority@bilbilash.edu')
      .single();

    if (existingAuthority) {
      console.log('Authority user already exists. Skipping seeding.');
      return;
    }

    // Get Authority role
    const { data: roleData } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'authority')
      .single();

    if (!roleData) {
      throw new Error('Authority role not found. Please run the database setup script first.');
    }

    // Create Authority user
    const authorityPassword = 'Authority@2024'; // Change this in production
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(authorityPassword, saltRounds);

    const { data: authorityUser } = await supabase
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

    if (!authorityUser) {
      throw new Error('Error creating Authority user');
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
