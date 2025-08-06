import React, { useState } from 'react';
import { X, Save, Handshake, IndianRupee, Calendar, User, Building, FileText } from 'lucide-react';
import { Deal, Customer, Currency } from '../utils/types';
import { currencies } from '../utils/data';

interface DealDetailProps {
  deal: Deal;
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ deal, customers, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    dealName: deal.dealName,
    customerId: deal.customerId,
    amount: deal.amount.toString(),
    currency: deal.currency,
    expectedCloseDate: deal.expectedCloseDate.toISOString().split('T')[0],
    stage: deal.stage,
    assignedTo: deal.assignedTo || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.dealName.trim() || !formData.customerId || !formData.amount || !formData.expectedCloseDate) {
      return;
    }
    
    setIsSaving(true);
    
    const customer = customers.find(c => c.id === formData.customerId);
    const updatedDeal: Deal = {
      ...deal,
      dealName: formData.dealName.trim(),
      customerId: formData.customerId,
      customerName: customer?.name || deal.customerName,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      expectedCloseDate: new Date(formData.expectedCloseDate),
      stage: formData.stage,
      assignedTo: formData.assignedTo || undefined,
      updatedAt: new Date()
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(updatedDeal);
    setIsSaving(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'proposal': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'negotiation': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'deal-closed': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'deal-lost': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
  };

  const getStageLabel = (stage: Deal['stage']) => {
    switch (stage) {
      case 'proposal': return 'Prospecting';
      case 'negotiation': return 'Qualification';
      case 'deal-closed': return 'Deals Closed';
      case 'deal-lost': return 'Deals Lost';
      default: return stage;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{deal.dealName}</h2>
              <p className="text-gray-600 dark:text-gray-400">Deal ID: {deal.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
              {getStageLabel(deal.stage)}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Deal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deal Name *
                </label>
                <input
                  type="text"
                  value={formData.dealName}
                  onChange={(e) => handleInputChange('dealName', e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      min="0"
                      step="1000"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <option value="deal-closed">Deals Closed</option>
                  <option value="deal-lost">Deals Lost</option>
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

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Deal Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Deal Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Deal ID:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{deal.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                    <span className="text-gray-900 dark:text-white">{deal.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(deal.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(deal.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(deal.updatedAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Expected Close:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(deal.expectedCloseDate)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deal.notes.length} notes attached
                </p>
              </div>
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
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;