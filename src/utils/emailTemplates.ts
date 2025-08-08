import { EmailData } from '../components/EmailModal';

export interface EmailTemplateOptions {
  documentType: string;
  documentNumber: string;
  customerName: string;
  amount?: number;
  companyName?: string;
}

export const generateEmailTemplate = (options: EmailTemplateOptions): Omit<EmailData, 'to' | 'attachDocument'> => {
  const { documentType, documentNumber, customerName, amount, companyName = 'Your Company' } = options;
  
  const subject = `${documentType} #${documentNumber} from ${companyName}`;
  
  let message = `Dear ${customerName},\n\n`;
  
  switch (documentType.toLowerCase()) {
    case 'invoice':
      message += `Please find attached your invoice #${documentNumber}`;
      if (amount) {
        message += ` for the amount of ₹${amount}`;
      }
      message += `.\n\nThank you for your business!`;
      break;
      
    case 'quote':
      message += `Please find attached your quote #${documentNumber}`;
      if (amount) {
        message += ` for the amount of ₹${amount}`;
      }
      message += `.\n\nWe look forward to working with you!`;
      break;
      
    case 'contract':
      message += `Please find attached your contract #${documentNumber} for your review and signature.\n\nPlease let us know if you have any questions.`;
      break;
      
    case 'receipt':
      message += `Please find attached your receipt #${documentNumber}`;
      if (amount) {
        message += ` for the payment of ₹${amount}`;
      }
      message += `.\n\nThank you for your payment!`;
      break;
      
    default:
      message += `Please find attached your ${documentType.toLowerCase()} #${documentNumber}.\n\nThank you for your business!`;
  }
  
  message += `\n\nBest regards,\n${companyName}`;
  
  return {
    subject,
    message
  };
};

export const getCustomerEmail = (customerId: string, customers: any[]): string => {
  const customer = customers.find(c => c.id === customerId);
  return customer?.email || '';
};
