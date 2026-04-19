#!/usr/bin/env node

/**
 * Database Setup Script for Supabase
 * 
 * This script automatically runs all SQL files in Supabase
 * without requiring manual SQL execution.
 * 
 * Usage: node scripts/setupDatabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Security: Validate environment variables first
const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_PROJECT_URL;
const missing = [];

if (!supabaseUrl) {
  missing.push('SUPABASE_URL or SUPABASE_PROJECT_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  missing.push('SUPABASE_SERVICE_ROLE_KEY');
}

if (missing.length > 0) {
  console.error(`${colors.red}Error: Missing required environment variables:${colors.reset}`);
  missing.forEach(key => console.error(`${colors.red}  - ${key}${colors.reset}`));
  console.log(`\n${colors.yellow}Please set these environment variables before running the script.${colors.reset}`);
  process.exit(1);
}

// Initialize Supabase client with service role key (admin privileges)
const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// SQL files to execute in order
const sqlFiles = [
  { name: 'Initial Data', path: 'config/database.sql' },
  { name: 'Main Schema', path: 'schema.sql' },
  { name: 'Database Functions', path: 'config/functions.sql' },
  { name: 'Additional Functions', path: 'config/additionalFunctions.sql' }
];

// Split SQL script into executable statements while preserving quoted strings and dollar-quoted blocks
const splitSQLStatements = (sqlContent) => {
  const statements = [];
  let buffer = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarQuoteTag = null;

  for (let i = 0; i < sqlContent.length; i++) {
    const char = sqlContent[i];
    const next = sqlContent[i + 1];

    if (inLineComment) {
      buffer += char;
      if (char === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      buffer += char;
      if (char === '*' && next === '/') {
        buffer += next;
        i += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag && char === '-' && next === '-') {
      inLineComment = true;
      buffer += char;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag && char === '/' && next === '*') {
      inBlockComment = true;
      buffer += char;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote && !dollarQuoteTag && char === '$') {
      const tagMatch = sqlContent.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
      if (tagMatch) {
        dollarQuoteTag = tagMatch[0];
        buffer += dollarQuoteTag;
        i += dollarQuoteTag.length - 1;
        continue;
      }
    }

    if (dollarQuoteTag) {
      buffer += char;
      if (sqlContent.slice(i, i + dollarQuoteTag.length) === dollarQuoteTag) {
        buffer += sqlContent.slice(i + 1, i + dollarQuoteTag.length);
        i += dollarQuoteTag.length - 1;
        dollarQuoteTag = null;
      }
      continue;
    }

    if (!inDoubleQuote && char === '\'' && !inSingleQuote) {
      inSingleQuote = true;
      buffer += char;
      continue;
    }

    if (inSingleQuote) {
      buffer += char;
      if (char === '\'' && next !== '\'') {
        inSingleQuote = false;
      }
      continue;
    }

    if (!inSingleQuote && char === '"' && !inDoubleQuote) {
      inDoubleQuote = true;
      buffer += char;
      continue;
    }

    if (inDoubleQuote) {
      buffer += char;
      if (char === '"') {
        inDoubleQuote = false;
      }
      continue;
    }

    if (char === ';') {
      const stmt = buffer.trim();
      if (stmt.length > 0) {
        statements.push(stmt);
      }
      buffer = '';
      continue;
    }

    buffer += char;
  }

  const finalStatement = buffer.trim();
  if (finalStatement.length > 0) {
    statements.push(finalStatement);
  }

  return statements;
};

const checkExecSqlFunction = async () => {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' });
    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    const message = error?.message || '';
    return message.includes('does not exist') || message.includes('Could not find the function');
  }
};

// Execute SQL file
async function executeSQLFile(filePath, fileName) {
  try {
    console.log(`${colors.blue}Executing ${fileName}...${colors.reset}`);
    
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}Warning: ${filePath} not found, skipping...${colors.reset}`);
      return { success: true, message: 'File not found' };
    }
    
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    
    const statements = splitSQLStatements(sqlContent).filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          errors.push({
            statement: statement.substring(0, 100) + '...',
            error: error.message
          });
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        errors.push({
          statement: statement.substring(0, 100) + '...',
          error: err.message
        });
        errorCount++;
      }
    }
    
    console.log(`${colors.green}  ${successCount} statements executed successfully${colors.reset}`);
    
    if (errorCount > 0) {
      console.log(`${colors.red}  ${errorCount} statements failed${colors.reset}`);
      errors.forEach(err => {
        console.log(`${colors.red}    ${err.statement}: ${err.error}${colors.reset}`);
      });
    }
    
    return { 
      success: errorCount === 0, 
      message: `${successCount} successful, ${errorCount} failed`,
      errors 
    };
    
  } catch (error) {
    console.error(`${colors.red}Error executing ${fileName}:${colors.reset}`, error.message);
    return { success: false, message: error.message, error };
  }
}

// Alternative: Create SQL instructions for manual execution
function generateManualInstructions() {
  console.log(`\n${colors.cyan}=== MANUAL SETUP INSTRUCTIONS ===${colors.reset}`);
  console.log(`\n${colors.yellow}Since automatic execution may have limitations, here are the manual steps:${colors.reset}\n`);
  
  sqlFiles.forEach((file, index) => {
    const fullPath = path.join(__dirname, '..', file.path);
    console.log(`${colors.bright}${index + 1}. ${file.name}:${colors.reset}`);
    console.log(`   File: ${file.path}`);
    console.log(`   Path: ${fullPath}`);
    console.log(`   Instructions:`);
    console.log(`   - Go to your Supabase dashboard`);
    console.log(`   - Navigate to SQL Editor`);
    console.log(`   - Copy and paste the entire content from ${file.path}`);
    console.log(`   - Click "Run" to execute`);
    console.log(`   - Wait for completion before proceeding to next file\n`);
  });
  
  console.log(`${colors.green}After completing all SQL files:${colors.reset}`);
  console.log(`1. Run the seed script: npm run seed`);
  console.log(`2. Start the backend: npm start`);
  console.log(`3. Start the frontend: cd frontend && npm start\n`);
}

// Check database connection
async function checkConnection() {
  try {
    console.log(`${colors.blue}Testing database connection...${colors.reset}`);
    const { data, error } = await supabase.from('_temp').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log(`${colors.green}Database connection successful!${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Database connection failed:${colors.reset}`, error.message);
    return false;
  }
}

// Main setup function
async function setupDatabase() {
  console.log(`${colors.cyan}=== Bilbilash Alumni Database Setup ===${colors.reset}\n`);
  
  // Check connection first
  const connected = await checkConnection();
  if (!connected) {
    console.log(`${colors.yellow}Connection failed. Please check your Supabase credentials.${colors.reset}`);
    generateManualInstructions();
    return;
  }

  const hasExecSql = await checkExecSqlFunction();
  if (!hasExecSql) {
    console.log(`${colors.red}Missing helper function: exec_sql${colors.reset}`);
    console.log(`${colors.yellow}The project requires the SQL helper function to execute database setup scripts automatically.${colors.reset}`);
    console.log(`${colors.cyan}Run the contents of backend/config/database.sql manually in your Supabase SQL editor to create the required schema and helper functions.${colors.reset}`);
    generateManualInstructions();
    return;
  }
  
  console.log(`${colors.yellow}Starting database setup...${colors.reset}\n`);
  
  let totalSuccess = 0;
  let totalErrors = 0;
  
  // Execute each SQL file
  for (const file of sqlFiles) {
    const result = await executeSQLFile(file.path, file.name);
    
    if (result.success) {
      totalSuccess++;
      console.log(`${colors.green}  ${file.name}: SUCCESS${colors.reset}\n`);
    } else {
      totalErrors++;
      console.log(`${colors.red}  ${file.name}: FAILED${colors.reset}\n`);
    }
  }
  
  // Summary
  console.log(`${colors.bright}=== Setup Summary ===${colors.reset}`);
  console.log(`Total files: ${sqlFiles.length}`);
  console.log(`Successful: ${totalSuccess}`);
  console.log(`Failed: ${totalErrors}`);
  
  if (totalErrors > 0) {
    console.log(`\n${colors.yellow}Some files failed to execute automatically.${colors.reset}`);
    console.log(`${colors.yellow}Please follow the manual instructions below:${colors.reset}`);
    generateManualInstructions();
  } else {
    console.log(`\n${colors.green}Database setup completed successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`1. Run: npm run seed (to create authority account)`);
    console.log(`2. Run: npm start (to start backend server)`);
    console.log(`3. Run: cd frontend && npm start (to start frontend)`);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase, executeSQLFile, checkConnection };
