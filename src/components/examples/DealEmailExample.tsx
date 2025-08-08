// Example usage of EmailModal with Deal entity
// This demonstrates how to integrate the EmailModal with other entities

import { useState } from 'react';
import { Deal } from '../../utils/types';
import EmailModal, { EmailData } from '../EmailModal';
import { generateEmailTemplate, getCustomerEmail } from '../../utils/emailTemplates';
import { mockCustomers } from '../../utils/data';

interface DealEmailExampleProps {
  deal: Deal;
  plan: 'free' | 'starter' | 'professional';
}

const DealEmailExample: React.FC<DealEmailExampleProps> = ({ deal, plan }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Plan restrictions for email functionality
  const canSendEmail = plan === 'starter' || plan === 'professional';

  const handleSendEmail = async (emailData: EmailData) => {
    setIsSendingEmail(true);
    try {
      // Mock email sending - replace with actual email service
      console.log('Sending deal email:', emailData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Deal email sent successfully!');
      setShowEmailModal(false);
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      {/* Send Email Button for Deal */}
      {canSendEmail ? (
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowEmailModal(true)}
        >
          Send Quote
        </button>
      ) : (
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-500 cursor-not-allowed"
          disabled
          title="Upgrade to Starter+ to send emails"
        >
          Send Quote
        </button>
      )}

      {/* Email Modal for Deal/Quote */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        documentType="Quote"
        documentNumber={deal.id}
        defaultTo={getCustomerEmail(deal.customerId, mockCustomers)}
        defaultSubject={generateEmailTemplate({
          documentType: 'Quote',
          documentNumber: deal.id,
          customerName: deal.customerName,
          amount: deal.amount
        }).subject}
        defaultMessage={generateEmailTemplate({
          documentType: 'Quote',
          documentNumber: deal.id,
          customerName: deal.customerName,
          amount: deal.amount
        }).message}
        isLoading={isSendingEmail}
      />
    </div>
  );
};

export default DealEmailExample;
