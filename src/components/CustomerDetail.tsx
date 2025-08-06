import React, { useState } from 'react';
import { X, Save, Building, User, Phone, Mail, MapPin, Hash, Calendar, FileText } from 'lucide-react';
import { Customer, CustomerType } from '../utils/types';

interface CustomerDetailProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email || '',
    phone: customer.phone,
    address: customer.address || '',
    gstin: customer.gstin || '',
    companyName: customer.companyName || '',
    type: customer.type,
    stage: customer.stage
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }
    
    setIsSaving(true);
    
    const updatedCustomer: Customer = {
      ...customer,
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim(),
      address: formData.address.trim() || undefined,
      gstin: formData.gstin.trim() || undefined,
      companyName: formData.companyName.trim() || undefined,
      type: formData.type,
      stage: formData.stage,
      updatedAt: new Date()
    };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(updatedCustomer);
    setIsSaving(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateGSTIN = (gstin: string) => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
              customer.type === 'business' 
                ? 'bg-gradient-to-br from-purple-600 to-purple-700' 
                : 'bg-gradient-to-br from-green-600 to-green-700'
            }`}>
              {customer.type === 'business' ? (
                <Building className="w-6 h-6" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{customer.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">Customer ID: {customer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInputChange('type', 'individual')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      formData.type === 'individual'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Individual</span>
                  </button>
                  <button
                    onClick={() => handleInputChange('type', 'business')}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      formData.type === 'business'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>Business</span>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {formData.type === 'business' ? 'Contact Person Name' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Company Name for Business */}
              {formData.type === 'business' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* GSTIN for Business */}
                {formData.type === 'business' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GSTIN
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formData.gstin}
                        onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          formData.gstin && !validateGSTIN(formData.gstin)
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      />
                    </div>
                    {formData.gstin && !validateGSTIN(formData.gstin) && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">Invalid GSTIN format</p>
                    )}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Customer ID:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{customer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="capitalize text-gray-900 dark:text-white">{customer.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stage:</span>
                    <span className="capitalize text-gray-900 dark:text-white">{customer.stage}</span>
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
                    <p className="text-gray-900 dark:text-white">{formatDate(customer.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <p className="text-gray-900 dark:text-white">{formatDate(customer.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {customer.notes.length} notes attached
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
            disabled={!formData.name.trim() || !formData.phone.trim() || (formData.type === 'business' && formData.gstin && !validateGSTIN(formData.gstin)) || isSaving}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !formData.name.trim() || !formData.phone.trim() || (formData.type === 'business' && formData.gstin && !validateGSTIN(formData.gstin)) || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25'
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

export default CustomerDetail;