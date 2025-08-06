import React, { useState } from 'react';
import { X, Save, Receipt, IndianRupee, Calendar, Building, Percent } from 'lucide-react';
import { Bill, Customer, Currency, GSTRate } from '../utils/types';
import { currencies, gstRates } from '../utils/data';

interface BillEntryProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSave: (bill: Omit<Bill, 'id' | 'billNumber' | 'gstAmount' | 'totalAmount' | 'createdAt' | 'updatedAt'>) => void;
}

const BillEntry: React.FC<BillEntryProps> = ({ isOpen, onClose, customers, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    currency: 'INR' as Currency,
    gstRate: 18 as GSTRate,
    paymentStatus: 'pending' as Bill['paymentStatus'],
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.customerId || !formData.amount) {
      return;
    }
    
    setIsSaving(true);
    
    const billData: Omit<Bill, 'id' | 'billNumber' | 'gstAmount' | 'totalAmount' | 'createdAt' | 'updatedAt'> = {
      customerId: formData.customerId,
      customerName: '', // Will be set in parent component
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      date: new Date(),
      gstRate: formData.gstRate,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes.trim() || undefined
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(billData);
    
    // Reset form
    setFormData({
      customerId: '',
      amount: '',
      currency: 'INR',
      gstRate: 18,
      paymentStatus: 'pending',
      notes: ''
    });
    setIsSaving(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateGST = () => {
    const amount = parseFloat(formData.amount) || 0;
    return (amount * formData.gstRate) / 100;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const gst = calculateGST();
    return amount + gst;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Bill</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.companyName && `(${customer.companyName})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Amount *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GST Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GST Rate
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={formData.gstRate}
                onChange={(e) => handleInputChange('gstRate', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {gstRates.map(rate => (
                  <option key={rate} value={rate}>{rate}%</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bill Summary */}
          {formData.amount && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Bill Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Base Amount:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">GST ({formData.gstRate}%):</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(calculateGST())}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-purple-600 dark:text-purple-400">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or description..."
              rows={3}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.customerId || !formData.amount || isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !formData.customerId || !formData.amount || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Creating...' : 'Create Bill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillEntry;