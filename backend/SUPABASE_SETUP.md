# Supabase Setup Guide for Vinnora CRM

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: Vinnora CRM
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (usually 1-2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to your project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" under settings
4. Copy the following values:

   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public key**: This is your `SUPABASE_ANON_KEY`
   - **service_role secret key**: This is your `SUPABASE_SERVICE_KEY`

## Step 3: Create Database Schema

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `backend/database/schema-simple.sql` file (use this file instead of schema.sql)
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

**Note:** Use `schema-simple.sql` instead of `schema.sql` as it's optimized for Supabase and avoids permission issues with JWT configuration.

This will create:
- All the necessary tables (organizations, users, leads, customers, deals, bills, support_tickets, notes, activities, notifications)
- Proper indexes for performance
- Row Level Security (RLS) policies for multi-tenant security
- Trigger functions for automatic timestamp updates
- Sample demo data for testing

## Step 4: Configure Authentication

1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Under "Site URL", add your frontend URL (for development: `http://localhost:5173`)
3. Under "Redirect URLs", add: `http://localhost:5173/dashboard`
4. Save the settings

## Step 5: Update Your .env File

Replace the placeholder values in your `backend/.env` file:

```env
# Replace these with your actual Supabase credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Generate a secure JWT secret (32+ characters)
JWT_SECRET=your-super-secure-jwt-secret-here-make-it-long-and-random

# Server configuration
PORT=3001
NODE_ENV=development
```

## Step 6: Generate JWT Secret

For the JWT_SECRET, you can generate a secure random string:

**Option 1: Using Node.js**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/64

## Step 7: Test the Setup

1. Save your `.env` file with the actual credentials
2. Run the backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. You should see:
   ```
   ✅ Connected to Supabase successfully
   🚀 Server running on port 3001
   📡 WebSocket server initialized
   ```

## Step 8: Test API Endpoints

You can test the authentication endpoints:

**Register a new user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "organizationName": "Test Organization"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Common Issues:

1. **"Missing required environment variable"**
   - Make sure all environment variables in `.env` are set correctly
   - Double-check there are no typos in variable names

2. **"Invalid API key"**
   - Verify you copied the correct keys from Supabase dashboard
   - Make sure you're using the service_role key for SUPABASE_SERVICE_KEY

3. **Connection timeout**
   - Check your internet connection
   - Verify the SUPABASE_URL is correct

4. **RLS policies blocking queries**
   - The schema includes proper RLS policies
   - Make sure you're using the service_role key for backend operations

## Next Steps

Once your backend is running successfully:

1. **Frontend Integration**: Update your frontend to use the backend API
2. **Real-time Features**: Test WebSocket connections for live updates
3. **Data Migration**: Import any existing data into the new database
4. **Testing**: Run through all CRM features to ensure everything works
5. **Deployment**: Deploy both frontend and backend to production

Your enterprise-level CRM backend is now ready! 🚀
