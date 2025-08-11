#!/usr/bin/env node

/**
 * Database Schema Fix Script
 * This script helps you fix the JWT permission error in Supabase
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Supabase Database Schema...\n');

const schemaPath = path.join(__dirname, 'database', 'schema.sql');
const schemaSimplePath = path.join(__dirname, 'database', 'schema-simple.sql');

if (!fs.existsSync(schemaSimplePath)) {
    console.log('❌ schema-simple.sql file not found!');
    console.log('Please make sure the file exists in the database folder.');
    process.exit(1);
}

console.log('📋 Instructions to fix the permission error:');
console.log('');
console.log('The error "permission denied to set parameter app.jwt_secret" occurs because');
console.log('Supabase doesn\'t allow setting database parameters directly.');
console.log('');
console.log('🔧 Solution:');
console.log('1. Use the simplified schema instead');
console.log('2. In Supabase SQL Editor, run the contents of: database/schema-simple.sql');
console.log('3. This file excludes the problematic JWT configuration line');
console.log('');
console.log('📝 Steps:');
console.log('1. Open Supabase Dashboard');
console.log('2. Go to SQL Editor');
console.log('3. Click "New Query"');
console.log('4. Copy and paste the contents of: database/schema-simple.sql');
console.log('5. Click "Run"');
console.log('');
console.log('✅ The simplified schema includes:');
console.log('   - All database tables');
console.log('   - Proper indexes');
console.log('   - Trigger functions');
console.log('   - Sample data');
console.log('   - NO problematic JWT configuration');
console.log('');
console.log('🔒 Authentication:');
console.log('   - JWT handling is done by the backend server');
console.log('   - Supabase handles its own authentication');
console.log('   - No database-level JWT configuration needed');
console.log('');
console.log('🚀 After running the schema:');
console.log('   - Start your backend: npm run dev');
console.log('   - Test the API: node test-api.js');
console.log('   - Connect your frontend');
console.log('');

console.log('📄 File to use: database/schema-simple.sql');
console.log('📄 File size:', fs.statSync(schemaSimplePath).size, 'bytes');
console.log('');
console.log('🎉 This should resolve the permission error!\n');
