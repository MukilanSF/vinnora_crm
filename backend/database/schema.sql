-- Vinnora CRM Database Schema
-- This file contains the complete database schema for the CRM application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
    subscription_id VARCHAR(255),
    billing_email VARCHAR(255),
    settings JSONB DEFAULT '{}',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'sales-rep' CHECK (role IN ('admin', 'manager', 'sales-rep')),
    active BOOLEAN DEFAULT true,
    plan VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    avatar_url TEXT,
    phone VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    service_interest VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    company VARCHAR(255),
    industry VARCHAR(100),
    value DECIMAL(15,2) DEFAULT 0,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    last_contact TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect')),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_name VARCHAR(255) NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    expected_close_date DATE NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'proposal' CHECK (stage IN ('proposal', 'negotiation', 'deal-closed', 'lost')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    items JSONB NOT NULL DEFAULT '[]',
    taxes DECIMAL(15,2) DEFAULT 0,
    discount DECIMAL(15,2) DEFAULT 0,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    description TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'pending-customer', 'resolved', 'closed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (category IN ('bug', 'feature', 'support', 'billing', 'other')),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    due_date TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('lead', 'customer', 'deal', 'bill', 'ticket')),
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'note' CHECK (type IN ('note', 'call', 'meeting', 'email', 'whatsapp')),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tags TEXT[],
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (for tracking user actions)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('lead', 'customer', 'deal', 'bill', 'ticket')),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_leads_organization_id ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_organization_id ON deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_customer_id ON deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_bills_organization_id ON bills(organization_id);
CREATE INDEX IF NOT EXISTS idx_bills_customer_id ON bills(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_organization_id ON support_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_notes_entity_id_type ON notes(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_notes_organization_id ON notes(organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity_id_type ON activities(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_activities_organization_id ON activities(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their own organization" ON organizations
    FOR SELECT USING (id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Admins can update their organization" ON organizations
    FOR UPDATE USING (
        id = auth.jwt() ->> 'organization_id'::text AND 
        auth.jwt() ->> 'role' = 'admin'
    );

-- RLS Policies for users
CREATE POLICY "Users can view users in their organization" ON users
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Admins can manage users in their organization" ON users
    FOR ALL USING (
        organization_id = auth.jwt() ->> 'organization_id'::text AND 
        auth.jwt() ->> 'role' IN ('admin', 'manager')
    );

-- RLS Policies for leads
CREATE POLICY "Users can view leads in their organization" ON leads
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage leads in their organization" ON leads
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for customers
CREATE POLICY "Users can view customers in their organization" ON customers
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage customers in their organization" ON customers
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for deals
CREATE POLICY "Users can view deals in their organization" ON deals
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage deals in their organization" ON deals
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for bills
CREATE POLICY "Users can view bills in their organization" ON bills
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage bills in their organization" ON bills
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for support tickets
CREATE POLICY "Users can view tickets in their organization" ON support_tickets
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage tickets in their organization" ON support_tickets
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for notes
CREATE POLICY "Users can view notes in their organization" ON notes
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can manage notes in their organization" ON notes
    FOR ALL USING (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for activities
CREATE POLICY "Users can view activities in their organization" ON activities
    FOR SELECT USING (organization_id = auth.jwt() ->> 'organization_id'::text);

CREATE POLICY "Users can create activities in their organization" ON activities
    FOR INSERT WITH CHECK (organization_id = auth.jwt() ->> 'organization_id'::text);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.jwt() ->> 'user_id'::text);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.jwt() ->> 'user_id'::text);

-- Sample data for development
INSERT INTO organizations (id, name, plan) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Demo Organization', 'professional')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, password_hash, name, role, organization_id) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'admin@demo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2kJjkU0RGm', 'Demo Admin', 'admin', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (email) DO NOTHING;

-- Add some sample leads
INSERT INTO leads (name, email, phone, service_interest, source, organization_id) VALUES 
    ('John Doe', 'john@example.com', '+1234567890', 'Web Development', 'Website', '550e8400-e29b-41d4-a716-446655440000'),
    ('Jane Smith', 'jane@example.com', '+1234567891', 'Mobile App', 'Referral', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;
