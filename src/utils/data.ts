import { Lead, Customer, Deal, Bill, Note, Reminder, User, DashboardStats, SupportTicket } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    active: true
  },
  {
    id: '2',
    name: 'Sales Rep 1',
    email: 'sales1@company.com',
    role: 'sales-rep',
    active: true
  },
  {
    id: '3',
    name: 'Sales Rep 2',
    email: 'sales2@company.com',
    role: 'sales-rep',
    active: true
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@example.com',
    location: 'Mumbai, Maharashtra',
    serviceInterest: 'Web Development',
    source: 'Website Form',
    stage: 'new',
    notes: [],
    nextFollowUp: new Date('2024-01-16'),
    assignedTo: '2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@startup.com',
    location: 'Bangalore, Karnataka',
    serviceInterest: 'Mobile App Development',
    source: 'Facebook Ads',
    stage: 'contacted',
    notes: [],
    nextFollowUp: new Date('2024-01-17'),
    assignedTo: '2',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit@business.com',
    location: 'Ahmedabad, Gujarat',
    serviceInterest: 'E-commerce Platform',
    source: 'WhatsApp',
    stage: 'interested',
    notes: [],
    nextFollowUp: new Date('2024-01-18'),
    assignedTo: '3',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha@company.com',
    location: 'Hyderabad, Telangana',
    serviceInterest: 'Digital Marketing',
    source: 'Referral',
    stage: 'proposal-sent',
    notes: [],
    nextFollowUp: new Date('2024-01-19'),
    assignedTo: '2',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Tech Solutions Pvt Ltd',
    email: 'contact@techsolutions.com',
    phone: '+91 98765 43210',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    gstin: '27AABCT1332L1ZZ',
    companyName: 'Tech Solutions Pvt Ltd',
    type: 'business',
    stage: 'qualified',
    notes: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Ravi Gupta',
    email: 'ravi@personal.com',
    phone: '+91 87654 32109',
    address: 'Koramangala, Bangalore, Karnataka 560034',
    type: 'individual',
    stage: 'contacted',
    notes: [],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    dealName: 'Website Redesign Project',
    customerId: '1',
    customerName: 'Tech Solutions Pvt Ltd',
    amount: 250000,
    currency: 'INR',
    expectedCloseDate: new Date('2024-02-15'),
    stage: 'proposal',
    notes: [],
    assignedTo: '2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    dealName: 'Mobile App Development',
    customerId: '2',
    customerName: 'Ravi Gupta',
    amount: 150000,
    currency: 'INR',
    expectedCloseDate: new Date('2024-02-28'),
    stage: 'negotiation',
    notes: [],
    assignedTo: '3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockBills: Bill[] = [
  {
    id: '1',
    billNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Tech Solutions Pvt Ltd',
    amount: 100000,
    currency: 'INR',
    date: new Date('2024-01-15'),
    gstRate: 18,
    gstAmount: 18000,
    totalAmount: 118000,
    paymentStatus: 'pending',
    status: 'pending', // Added for compatibility
    description: 'Web Development Services - Phase 1', // Added for compatibility
    notes: 'First milestone payment',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockNotes: Note[] = [
  {
    id: '1',
    entityId: '1',
    entityType: 'lead',
    content: 'Initial contact made. Customer interested in web development services. Scheduled follow-up call.',
    date: new Date('2024-01-15'),
    tags: ['initial-contact', 'interested'],
    type: 'call',
    createdBy: '2'
  },
  {
    id: '2',
    entityId: '1',
    entityType: 'deal',
    content: 'Sent detailed proposal with timeline and pricing. Customer reviewing internally.',
    date: new Date('2024-01-14'),
    tags: ['proposal', 'pricing'],
    type: 'email',
    createdBy: '2'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    entityId: '1',
    entityType: 'lead',
    entityName: 'Rajesh Kumar',
    message: 'Follow up on web development inquiry',
    date: new Date('2024-01-16'),
    completed: false,
    type: 'follow-up'
  },
  {
    id: '2',
    entityId: '2',
    entityType: 'lead',
    entityName: 'Priya Sharma',
    message: 'Send mobile app portfolio',
    date: new Date('2024-01-17'),
    completed: false,
    type: 'follow-up'
  },
  {
    id: '3',
    entityId: '1',
    entityType: 'deal',
    entityName: 'Website Redesign Project',
    message: 'Check proposal status',
    date: new Date('2024-01-18'),
    completed: false,
    type: 'follow-up'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    title: 'Unable to import CSV data',
    description: 'Getting an error when trying to import customer data from CSV file. The error message says "Invalid file format" but the CSV looks correct.',
    status: 'open',
    priority: 'high',
    category: 'technical',
    assignedTo: 'Support Team',
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    notes: []
  },
  {
    id: '2',
    title: 'Billing calculation incorrect',
    description: 'GST calculation seems wrong for 18% rate. The total amount is not matching our manual calculations.',
    status: 'in-progress',
    priority: 'urgent',
    category: 'billing',
    assignedTo: 'Tech Support',
    createdBy: 'admin',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15'),
    notes: []
  },
  {
    id: '3',
    title: 'Feature request: WhatsApp integration',
    description: 'Would like to have WhatsApp integration to send follow-up messages directly from the CRM.',
    status: 'resolved',
    priority: 'medium',
    category: 'feature-request',
    createdBy: 'admin',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-15'),
    notes: []
  }
];

export const mockDashboardStats: DashboardStats = {
  totalLeads: 4,
  totalCustomers: 2,
  totalDeals: 2,
  totalRevenue: 400000,
  pendingFollowUps: 3,
  dealsThisMonth: 2,
  conversionRate: 50
};

export const leadSources = [
  'Website Form',
  'Facebook Ads',
  'Google Ads',
  'WhatsApp',
  'Referral',
  'Cold Call',
  'Email Campaign',
  'LinkedIn',
  'Trade Show',
  'Other'
];

export const serviceInterests = [
  'Web Development',
  'Mobile App Development',
  'E-commerce Platform',
  'Digital Marketing',
  'SEO Services',
  'Social Media Marketing',
  'Graphic Design',
  'Content Writing',
  'Consulting',
  'Other'
];

export const gstRates = [5, 12, 18, 28] as const;
export const currencies = ['INR', 'USD', 'EUR'] as const;