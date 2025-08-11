import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // Use service key for server operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Create Supabase client with anon key for client-side operations
export const supabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Database schema types
export interface DatabaseUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'sales-rep';
  active: boolean;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  organization_id: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
  phone?: string;
  timezone?: string;
  preferences?: Record<string, any>;
}

export interface DatabaseLead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  location?: string;
  service_interest: string;
  source: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  next_follow_up?: string;
  score?: number;
  tags?: string[];
  notes?: string;
}

export interface DatabaseCustomer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  location?: string;
  company?: string;
  industry?: string;
  value: number;
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  last_contact?: string;
  status: 'active' | 'inactive' | 'prospect';
  tags?: string[];
  notes?: string;
}

export interface DatabaseDeal {
  id: string;
  deal_name: string;
  customer_id: string;
  amount: number;
  currency: string;
  expected_close_date: string;
  stage: 'proposal' | 'negotiation' | 'deal-closed' | 'lost';
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  probability?: number;
  tags?: string[];
  notes?: string;
}

export interface DatabaseBill {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  organization_id: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  invoice_number: string;
  description?: string;
  taxes?: number;
  discount?: number;
}

export interface DatabaseSupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'pending-customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'bug' | 'feature' | 'support' | 'billing' | 'other';
  customer_id?: string;
  assigned_to?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  due_date?: string;
  tags?: string[];
  attachments?: string[];
}

export interface DatabaseNote {
  id: string;
  entity_id: string;
  entity_type: 'lead' | 'customer' | 'deal' | 'bill' | 'ticket';
  content: string;
  type: 'note' | 'call' | 'meeting' | 'email' | 'whatsapp';
  created_by: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  attachments?: string[];
}

export interface DatabaseActivity {
  id: string;
  entity_id: string;
  entity_type: 'lead' | 'customer' | 'deal' | 'bill' | 'ticket';
  action: string;
  description: string;
  created_by: string;
  organization_id: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface DatabaseOrganization {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  created_at: string;
  updated_at: string;
  settings?: Record<string, any>;
  billing_email?: string;
  subscription_id?: string;
  subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due';
  trial_ends_at?: string;
}
