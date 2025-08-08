import { useState, useEffect } from 'react';
import { X, Mail, Send } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (emailData: EmailData) => Promise<void>;
  documentType: string; // e.g., "Invoice", "Quote", "Contract"
  documentNumber?: string;
  defaultTo?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  isLoading?: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  attachDocument: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  onSend,
  documentType,
  documentNumber,
  defaultTo = '',
  defaultSubject = '',
  defaultMessage = '',
  isLoading = false
}) => {
  const [emailForm, setEmailForm] = useState<EmailData>({
    to: defaultTo,
    subject: defaultSubject,
    message: defaultMessage,
    attachDocument: true
  });

  // Reset form when modal opens with new defaults
  useEffect(() => {
    if (isOpen) {
      setEmailForm({
        to: defaultTo,
        subject: defaultSubject,
        message: defaultMessage,
        attachDocument: true
      });
    }
  }, [isOpen, defaultTo, defaultSubject, defaultMessage]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setEmailForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await onSend(emailForm);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const isFormValid = emailForm.to && emailForm.subject;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative">
        {/* Email Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="w-8 h-8 text-blue-600 bg-blue-100 rounded-lg p-2" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Send {documentType} Email</h3>
              {documentNumber && (
                <p className="text-sm text-gray-600">{documentType} #{documentNumber}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Email Form */}
        <div className="px-6 py-4 space-y-4">
          {/* To Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to
            </label>
            <input
              type="email"
              name="to"
              value={emailForm.to}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="customer@email.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={emailForm.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={emailForm.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Attachment Option */}
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="attachDocument"
              name="attachDocument"
              checked={emailForm.attachDocument}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <label htmlFor="attachDocument" className="text-sm font-medium text-blue-700">
              Attach {documentType.toLowerCase()} PDF
            </label>
          </div>

          {/* Loading status */}
          {isLoading && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 font-medium">Sending email...</span>
            </div>
          )}
        </div>

        {/* Email Modal Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
