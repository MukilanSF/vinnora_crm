# EmailModal Component

A reusable email modal component for sending emails with document attachments across different entities in the CRM system.

## Features

- ✅ Reusable across different document types (Invoice, Quote, Contract, Receipt)
- ✅ Auto-populated email templates based on document type
- ✅ Customer email auto-fill
- ✅ Plan-based restrictions (Starter+ required)
- ✅ Form validation
- ✅ Loading states
- ✅ Responsive design
- ✅ TypeScript support

## Usage

### Basic Implementation

```tsx
import EmailModal, { EmailData } from './EmailModal';
import { generateEmailTemplate, getCustomerEmail } from '../utils/emailTemplates';

const MyComponent = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmail = async (emailData: EmailData) => {
    setIsSendingEmail(true);
    try {
      // Your email sending logic here
      await sendEmailService(emailData);
      alert('Email sent successfully!');
      setShowEmailModal(false);
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      <button onClick={() => setShowEmailModal(true)}>
        Send Email
      </button>

      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        documentType="Invoice"
        documentNumber="INV-001"
        defaultTo="customer@example.com"
        defaultSubject="Invoice #INV-001 from Your Company"
        defaultMessage="Dear Customer,..."
        isLoading={isSendingEmail}
      />
    </div>
  );
};
```

### With Email Templates

```tsx
// Use the email template helper for consistent messaging
const templateData = generateEmailTemplate({
  documentType: 'Invoice',
  documentNumber: bill.billNumber,
  customerName: bill.customerName,
  amount: bill.amount,
  companyName: 'Your Company' // optional
});

<EmailModal
  isOpen={showEmailModal}
  onClose={() => setShowEmailModal(false)}
  onSend={handleSendEmail}
  documentType="Invoice"
  documentNumber={bill.billNumber}
  defaultTo={getCustomerEmail(bill.customerId, mockCustomers)}
  defaultSubject={templateData.subject}
  defaultMessage={templateData.message}
  isLoading={isSendingEmail}
/>
```

### Plan-Based Restrictions

```tsx
// Check plan before showing email functionality
const canSendEmail = plan === 'starter' || plan === 'professional';

{canSendEmail ? (
  <button onClick={() => setShowEmailModal(true)}>
    Send Email
  </button>
) : (
  <button disabled title="Upgrade to Starter+ to send emails">
    Send Email
  </button>
)}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Called when modal is closed |
| `onSend` | `(emailData: EmailData) => Promise<void>` | ✅ | Called when email is sent |
| `documentType` | `string` | ✅ | Type of document (e.g., "Invoice", "Quote") |
| `documentNumber` | `string` | ❌ | Document identifier for display |
| `defaultTo` | `string` | ❌ | Pre-filled recipient email |
| `defaultSubject` | `string` | ❌ | Pre-filled email subject |
| `defaultMessage` | `string` | ❌ | Pre-filled email message |
| `isLoading` | `boolean` | ❌ | Shows loading state when sending |

## EmailData Interface

```tsx
interface EmailData {
  to: string;              // Recipient email
  subject: string;         // Email subject
  message: string;         // Email body
  attachDocument: boolean; // Whether to attach the document PDF
}
```

## Email Templates

The `emailTemplates.ts` utility provides consistent email templates:

### Supported Document Types

- **Invoice**: Payment-focused messaging
- **Quote**: Sales-focused messaging  
- **Contract**: Review and signature messaging
- **Receipt**: Payment confirmation messaging
- **Default**: Generic business messaging

### Template Generation

```tsx
import { generateEmailTemplate } from '../utils/emailTemplates';

const template = generateEmailTemplate({
  documentType: 'Invoice',
  documentNumber: 'INV-001',
  customerName: 'John Doe',
  amount: 5000,
  companyName: 'Your Company' // optional, defaults to "Your Company"
});

// Returns: { subject: string, message: string }
```

### Customer Email Helper

```tsx
import { getCustomerEmail } from '../utils/emailTemplates';

const customerEmail = getCustomerEmail(customerId, mockCustomers);
```

## Examples

See `src/components/examples/DealEmailExample.tsx` for a complete implementation example with the Deal entity.

## Integration with Other Entities

The EmailModal can be easily integrated with any entity:

1. **Import the component and helpers**
2. **Set up state management**
3. **Implement the send email handler**
4. **Configure email templates**
5. **Add plan-based restrictions**

The component is designed to be flexible and can adapt to different document types and business requirements.
