# Razorpay Integration Guide

## Overview
This document explains how to set up and use Razorpay payment gateway integration in the Vinnora CRM application.

## Setup Instructions

### 1. Razorpay Account Setup
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account or log in
3. Generate API Keys:
   - Go to Settings → API Keys
   - Generate Key ID and Key Secret
   - Copy the Key ID for frontend integration

### 2. Update Configuration
Update the Razorpay configuration in `src/utils/razorpayConfig.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  keyId: 'your_razorpay_key_id', // Replace with your actual Key ID
  companyName: 'Your Company Name',
  companyDescription: 'Your Description',
  companyLogo: '/your-logo.png',
  themeColor: '#your_brand_color',
  currency: 'INR',
  defaultCustomer: {
    name: 'Customer Name',
    email: 'customer@example.com',
    contact: '9999999999'
  }
};
```

### 3. Test Mode vs Production

#### Test Mode
- Use test Key ID (starts with `rzp_test_`)
- Test payments will not charge real money
- Use test card numbers provided by Razorpay

#### Production Mode
- Use live Key ID (starts with `rzp_live_`)
- Real payments will be processed
- Activate your account with KYC documents

## Features Implemented

### 1. Payment Modal Integration
- **File**: `src/components/PaymentModal.tsx`
- **Features**:
  - Razorpay secure checkout
  - Manual payment form (for testing)
  - Payment method selection
  - Success/failure handling

### 2. Payment Methods Supported
- Credit/Debit Cards (Visa, MasterCard, RuPay)
- UPI (GPay, PhonePe, Paytm, etc.)
- Net Banking (All major banks)
- Digital Wallets (Paytm, FreeCharge, etc.)

### 3. Security Features
- 256-bit SSL encryption
- PCI DSS compliant
- Secure tokenization
- Fraud detection

## Usage Example

```typescript
// In your component
const handleUpgrade = (planId: string) => {
  // Open payment modal with selected plan
  setSelectedPlan(plans.find(p => p.id === planId));
  setShowPaymentModal(true);
};

// Payment success handler
const handlePaymentSuccess = (newPlan: string) => {
  // Update user's plan
  updateUserPlan(newPlan);
  // Show success message
  showSuccessNotification('Plan upgraded successfully!');
};
```

## Testing

### Test Card Numbers
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs
- **Success**: success@razorpay
- **Failure**: failure@razorpay

## Error Handling

The integration includes comprehensive error handling:
- Network failures
- Payment failures
- User cancellation
- Invalid payment details

## Webhook Integration (Optional)

For server-side payment verification, implement webhooks:
1. Create webhook endpoint on your server
2. Verify payment signature
3. Update user subscription status
4. Send confirmation emails

## Support

For issues related to:
- **Razorpay**: Contact Razorpay support
- **Integration**: Check this documentation or contact the development team

## Security Best Practices

1. **Never expose Key Secret** in frontend code
2. **Verify payments** on server-side using webhooks
3. **Use HTTPS** in production
4. **Validate payment amounts** on server
5. **Log payment attempts** for auditing

## Compliance

This integration follows:
- PCI DSS guidelines
- RBI payment regulations
- GDPR data protection standards
- Indian IT Act compliance
