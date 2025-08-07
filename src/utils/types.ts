export type CustomerType = 'individual' | 'business';
export type LeadStage = 'new' | 'contacted' | 'interested' | 'proposal-sent' | 'deal-closed' | 'lost';
export type DealStage = 'proposal' | 'negotiation' | 'deal-closed' | 'deal-lost';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type UserRole = 'admin' | 'sales-rep';
export type Currency = 'INR' | 'USD' | 'EUR';
export type GSTRate = 5 | 12 | 18 | 28;
export type EntityType = 'leads' | 'customers' | 'deals' | 'bills';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  serviceInterest: string;
  source: string;
  stage: LeadStage;
  notes: Note[];
  nextFollowUp?: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstin?: string;
  companyName?: string;
  type: CustomerType;
  stage: 'new' | 'contacted' | 'qualified' | 'lost';
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  dealName: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: Currency;
  expectedCloseDate: Date;
  stage: DealStage;
  notes: Note[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: Currency;
  date: Date;
  gstRate: GSTRate;
  gstAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}

export interface EntityConfig {
  id: EntityType;
  name: string;
  fields: EntityField[];
  uniqueIdField: string;
}

export interface Note {
  id: string;
  entityId: string;
  entityType: 'lead' | 'customer' | 'deal' | 'bill';
  content: string;
  date: Date;
  tags: string[];
  type: 'note' | 'call' | 'meeting' | 'email' | 'whatsapp';
  createdBy?: string;
}

export interface Reminder {
  id: string;
  entityId: string;
  entityType: 'lead' | 'customer' | 'deal';
  entityName: string;
  message: string;
  date: Date;
  completed: boolean;
  type: 'follow-up' | 'call' | 'meeting' | 'payment';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  totalDeals: number;
  totalRevenue: number;
  pendingFollowUps: number;
  dealsThisMonth: number;
  conversionRate: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'feature-request' | 'bug-report' | 'general';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
}

// Form interfaces
export interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  serviceInterest: string;
  source: string;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstin?: string;
  companyName?: string;
  type: CustomerType;
}

export interface DealFormData {
  dealName: string;
  customerId: string;
  amount: number;
  currency: Currency;
  expectedCloseDate: Date;
  assignedTo?: string;
}

export interface BillFormData {
  customerId: string;
  amount: number;
  currency: Currency;
  gstRate: GSTRate;
  notes?: string;
}

export interface Inventory {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
}