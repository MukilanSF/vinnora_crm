// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Test Key ID - Replace with your actual Razorpay Key ID
  keyId: 'rzp_test_1234567890',
  
  // Company details
  companyName: 'Vinnora CRM',
  companyDescription: 'Professional CRM Solution',
  companyLogo: '/vite.svg',
  
  // Theme
  themeColor: '#ea580c',
  
  // Currency
  currency: 'INR',
  
  // Default customer details (can be overridden)
  defaultCustomer: {
    name: 'Customer',
    email: 'customer@example.com',
    contact: '9999999999'
  }
};

// Helper function to convert price string to amount in paise
export const convertToAmount = (priceString: string): number => {
  const price = priceString.replace(/[₹,]/g, '');
  if (price === 'Custom') return 0;
  return parseInt(price) * 100; // Convert to paise (smallest currency unit)
};

// Plan configurations with Razorpay integration
export const PLAN_CONFIGS = {
  starter: {
    amount: 299900, // ₹2,999 in paise
    period: 'monthly',
    notes: {
      plan_type: 'starter',
      billing_cycle: 'monthly'
    }
  },
  professional: {
    amount: 699900, // ₹6,999 in paise
    period: 'monthly',
    notes: {
      plan_type: 'professional',
      billing_cycle: 'monthly'
    }
  },
  enterprise: {
    amount: 1499900, // ₹14,999 in paise (if custom pricing is set)
    period: 'monthly',
    notes: {
      plan_type: 'enterprise',
      billing_cycle: 'monthly'
    }
  }
};
