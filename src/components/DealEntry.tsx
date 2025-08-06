import React, { useState } from 'react';
import { X, Save, IndianRupee, Calendar, User, Building } from 'lucide-react';
import { Deal, Customer, Currency } from '../utils/types';
import { currencies } from '../utils/data';

interface DealEntryProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSave: (deal: Omit<Deal, 'id' | 'customerName' | 'createdAt' | 'updatedAt'>) => void;
}

const DealEntry: React.FC<DealEntryProps> = ({ isOpen, onClose, customers, onSave }) => {
  const [formData, setFormData] = useState({
    dealName: '',
    customerId: '',
    amount: '',
    currency: 'INR' as Currency,
    expectedCloseDate: '',
    stage: 'proposal' as Deal['stage'],
    assignedTo: ''
  });
  const [isSaving, setIsSaving] = useState(false);


  const handleSave = async () => {
    if (!formData.dealName.trim() || !formData.customerId || !formData.amount || !formData.expectedCloseDate) {
      return;
    }
    
    setIsSaving(true);
    
    const dealData: Omit<Deal, 'id' | 'customerName' | 'createdAt' | 'updatedAt'> = {
      dealName: formData.dealName.trim(),
      customerId: formData.customerId,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      expectedCloseDate: new Date(formData.expectedCloseDate),
      stage: formData.stage,
      notes: [],
      assignedTo: formData.assignedTo || undefined
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(dealData);
    
    // Reset form
    setFormData({
      dealName: '',
      customerId: '',
      amount: '',
      currency: 'INR',
      expectedCloseDate: '',
      stage: 'proposal',
      assignedTo: ''
    });
    setIsSaving(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Deal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Deal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Name *
            </label>
            <input
              type="text"
              value={formData.dealName}
              onChange={(e) => handleInputChange('dealName', e.target.value)}
              placeholder="Enter deal name"
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Deal Amount *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Expected Close Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected Close Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => handleInputChange('stage', e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="proposal">Prospecting</option>
              <option value="negotiation">Qualification</option>
              <option value="deal-closed">Proposal</option>
              <option value="deal-lost">Negotiation</option>
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assigned To
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                placeholder="Sales rep name"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            disabled={!formData.dealName.trim() || !formData.customerId || !formData.amount || !formData.expectedCloseDate || isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !formData.dealName.trim() || !formData.customerId || !formData.amount || !formData.expectedCloseDate || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Saving...' : 'Save Deal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealEntry;