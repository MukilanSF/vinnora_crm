# Testing Setup Guide

## Plan & User Testing Features

This setup allows you to easily test different plan functionalities and switch between users without needing to log out and log back in.

### How to Test Different Plans

1. **Open Settings**: Click the "Settings" button in the top-right corner
2. **Go to Profile Tab**: Click on "Profile" in the settings sidebar
3. **Testing Controls Section**: You'll see a blue-highlighted section at the top called "Testing Controls (Development Mode)"

### Plan Testing

**Available Plans:**
- **Free Trial** (₹0) - Basic features only
- **Starter Plan** (₹2,999) - Email functionality, Basic reports  
- **Professional Plan** (₹6,999) - All features, Advanced analytics
- **Enterprise Plan** (₹14,999) - Custom integrations, Priority support

**To Switch Plans:**
1. Use the "Current Plan (for testing)" dropdown
2. Select any plan you want to test
3. The plan badge in the header will update immediately
4. All plan-restricted features will update in real-time

### User Testing

**Available Test Users:**
- **Admin User** (admin@company.com) - Full admin access
- **Sales Rep 1** (sales1@company.com) - Sales representative role
- **Sales Rep 2** (sales2@company.com) - Sales representative role

**To Switch Users:**
1. Use the "Switch User (for testing)" dropdown
2. Select any user to test their role
3. The profile information will auto-populate
4. The header will show the new user info

### Plan-Restricted Features to Test

#### Free Plan Limitations:
- ❌ Cannot download invoices (shows disabled button)
- ❌ Cannot send emails (shows disabled button with upgrade prompt)
- ❌ Limited dashboard features

#### Starter Plan (₹2,999):
- ✅ Can send emails from invoice detail modal
- ✅ Can download invoices
- ✅ Email functionality available in EmailModal component

#### Professional Plan (₹6,999):
- ✅ All Starter features
- ✅ Advanced entity management
- ✅ Full feature access

#### Enterprise Plan (₹14,999):
- ✅ All Professional features
- ✅ Priority support access
- ✅ Custom integrations

### Testing Workflow

1. **Start with Free Plan**: See all the limitations
2. **Switch to Starter**: Test email functionality in Invoice detail modal
3. **Switch to Professional**: Test advanced features
4. **Switch Users**: Test different user roles
5. **Mix and Match**: Try different user + plan combinations

### Visual Indicators

- **Plan Badge**: Top-right header shows current plan with colored badge
- **Disabled Buttons**: Free plan shows grayed-out buttons with tooltips
- **Upgrade Prompts**: Clear messaging when features require higher plans
- **Current Plan Info**: Settings shows plan details, pricing, and features

### Email Testing

1. Go to **Billing** tab
2. Click on any invoice to open detail modal
3. Try the **"Send Email"** button:
   - **Free Plan**: Button disabled with shield icon
   - **Starter+ Plans**: Opens EmailModal with pre-filled customer data

### Quick Test Scenarios

1. **Email Feature Test**:
   - Set plan to Free → Try to send email → Should be disabled
   - Set plan to Starter → Try to send email → Should work
   
2. **User Role Test**:
   - Switch to Sales Rep → Check available features
   - Switch to Admin → Check admin features
   
3. **Plan Upgrade Flow**:
   - Start Free → Try restricted feature → Upgrade to Starter → Feature works

This testing setup allows you to quickly validate that all plan-based restrictions and user roles are working correctly without needing multiple accounts or payment processing.
