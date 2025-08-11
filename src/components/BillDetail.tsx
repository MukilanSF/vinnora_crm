import { useState, useEffect } from 'react';
import { Bill } from '../utils/types';
import { X, Calendar, User, FileText, CreditCard, Mail, Shield } from 'lucide-react';
import { mockCustomers } from '../utils/data';
import EmailModal, { EmailData } from './EmailModal';
import { generateEmailTemplate, getCustomerEmail } from '../utils/emailTemplates';

interface BillDetailProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBill: Bill) => void;
  plan: 'free' | 'starter' | 'professional';
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-600 text-white',
  pending: 'bg-yellow-500 text-white',
  overdue: 'bg-red-600 text-white',
};

const BillDetail: React.FC<BillDetailProps> = ({ bill, isOpen, onClose, onSave, plan }) => {
  const [form, setForm] = useState<Bill | null>(bill);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Plan restrictions for email functionality
  const canSendEmail = plan === 'starter' || plan === 'professional';

  useEffect(() => {
    setForm(bill);
  }, [bill, isOpen]);

  if (!isOpen || !bill || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev =>
      prev
        ? {
            ...prev,
            [name]:
              type === 'number'
                ? Number(value)
                : name === 'amount'
                ? parseFloat(value)
                : value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      // Mock API/database save
      await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay
      onSave(form); // update parent state
      onClose();    // close modal
    }
  };

  const handleSendEmail = async (emailData: EmailData) => {
    setIsSendingEmail(true);
    try {
      // Mock email sending - replace with actual email service
      console.log('Sending email:', emailData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Email sent successfully!');
      setShowEmailModal(false);
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-4">
            <CreditCard className="w-10 h-10 text-blue-600 bg-blue-100 rounded-lg p-2" />
            <div>
              <div className="text-xl font-bold text-gray-900">{form.description || 'Bill Details'}</div>
              <div className="text-xs text-gray-500">Bill ID: {form.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="px-8 pt-4 pb-2 border-b border-gray-200 bg-white">
          <div className="flex justify-end space-x-3">
            {/* Download Invoice Button */}
            {plan !== 'free' ? (
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center text-sm"
                onClick={() => {
                  // Mock: Generate and download PDF (replace with real logic)
                  alert('Invoice PDF downloaded (mock)');
                  // In production, trigger backend to generate/download Invoice.pdf
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed flex items-center text-sm"
                disabled
                title="Upgrade to download Invoice"
              >
                <FileText className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
            )}

            {/* Send Email Button */}
            {canSendEmail ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                onClick={() => setShowEmailModal(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </button>
            ) : (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed flex items-center text-sm"
                disabled
                title="Upgrade to Starter+ to send emails"
              >
                <Shield className="w-4 h-4 mr-2" />
                Send Email
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer ID */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Customer ID</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="customerId"
                  value={form.customerId}
                  onChange={handleChange}
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  name="date"
                  value={typeof form.date === 'string' ? form.date : new Date(form.date).toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="py-2 px-3 w-full rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  className="pl-10 pr-3 py-2 w-full rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Timeline & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-2">Timeline</div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  Created:{" "}
                  {form.createdAt
                    ? new Date(form.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  Last Updated:{" "}
                  {form.updatedAt
                    ? new Date(form.updatedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Bill Status</div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColors[form.status] || 'bg-gray-200 text-gray-800'}`}>
                  {form.status ? form.status.charAt(0).toUpperCase() + form.status.slice(1) : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center pt-6 pb-2 gap-3">
            {/* Cancel & Save Changes Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        documentType="Invoice"
        documentNumber={form?.billNumber}
        defaultTo={bill ? getCustomerEmail(bill.customerId, mockCustomers) : ''}
        defaultSubject={bill ? generateEmailTemplate({
          documentType: 'Invoice',
          documentNumber: bill.billNumber,
          customerName: bill.customerName,
          amount: bill.totalAmount || bill.amount
        }).subject : ''}
        defaultMessage={bill ? generateEmailTemplate({
          documentType: 'Invoice',
          documentNumber: bill.billNumber,
          customerName: bill.customerName,
          amount: bill.totalAmount || bill.amount
        }).message : ''}
        isLoading={isSendingEmail}
      />
    </div>
  );
};

export default BillDetail;
