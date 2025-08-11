#!/usr/bin/env node

/**
 * Quick Setup Script for Vinnora CRM Backend
 * This script helps you verify your environment and get started quickly
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Vinnora CRM Backend Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('📝 Please copy .env.example to .env and fill in your Supabase credentials\n');
    process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Check required environment variables
const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET'
];

const missing = [];
const present = [];

requiredVars.forEach(varName => {
    if (process.env[varName]) {
        present.push(varName);
    } else {
        missing.push(varName);
    }
});

console.log('📋 Environment Variables Check:');
present.forEach(varName => {
    console.log(`✅ ${varName}: Set`);
});

missing.forEach(varName => {
    console.log(`❌ ${varName}: Missing`);
});

if (missing.length > 0) {
    console.log('\n🔧 To fix missing variables:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to Settings > API');
    console.log('3. Copy the values to your .env file');
    
    if (missing.includes('JWT_SECRET')) {
        console.log('\n🔐 To generate a JWT secret, run:');
        console.log(`JWT_SECRET=${crypto.randomBytes(64).toString('hex')}`);
    }
    
    console.log('\n📖 See SUPABASE_SETUP.md for detailed instructions\n');
    process.exit(1);
}

// Test Supabase connection
console.log('\n🔗 Testing Supabase connection...');
const { createClient } = require('@supabase/supabase-js');

try {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    );
    
    console.log('✅ Supabase client created successfully');
    console.log('🔗 URL:', process.env.SUPABASE_URL);
    
} catch (error) {
    console.log('❌ Failed to create Supabase client:', error.message);
    process.exit(1);
}

// Check if database schema is set up
console.log('\n📊 Checking database schema...');
console.log('💡 Make sure you\'ve run the schema.sql file in your Supabase SQL editor');

console.log('\n🎉 Setup looks good! You can now run:');
console.log('   npm run dev     - Start development server');
console.log('   npm run build   - Build for production');
console.log('   npm run start   - Start production server');

console.log('\n📚 Next steps:');
console.log('1. Run the database schema in Supabase SQL editor');
console.log('2. Start the development server with: npm run dev');
console.log('3. Test the API endpoints');
console.log('4. Connect your frontend to the backend');

console.log('\n🔧 Useful commands:');
console.log('   npm run check-env  - Check environment variables');
console.log('   npm run lint       - Check code quality');
console.log('   npm test           - Run tests');

console.log('\n📖 Documentation:');
console.log('   SUPABASE_SETUP.md  - Detailed Supabase setup guide');
console.log('   README.md          - Project documentation');

console.log('\n🚀 Happy coding!\n');
