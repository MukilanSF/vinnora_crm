import React, { useState } from 'react';
import { Search, Filter, Plus, Building, User, Phone, Mail, MapPin } from 'lucide-react';
import { Customer } from '../utils/types';
import SearchBar from './SearchBar';

interface CustomersListProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, onAddCustomer, onEditCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'business'>('all');
  const [selectedStage, setSelectedStage] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'lost'>('all');
  const [activeTab, setActiveTab] = useState<'customers' | 'otherTab' | null>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDetailOpen, setIsCustomerDetailOpen] = useState(false);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || customer.type === selectedType;
    const matchesStage = selectedStage === 'all' || customer.stage === selectedStage;
    
    return matchesSearch && matchesType && matchesStage;
  });

  const getStageColor = (stage: Customer['stage']) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <button
          onClick={onAddCustomer}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-green-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as any)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => onEditCustomer(customer)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        customer.type === 'business' 
                          ? 'bg-gradient-to-br from-purple-600 to-purple-700' 
                          : 'bg-gradient-to-br from-green-600 to-green-700'
                      }`}>
                        {customer.type === 'business' ? (
                          <Building className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </p>
                        {customer.companyName && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {customer.companyName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-48">{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900 dark:text-white">
                      {customer.type}
                    </span>
                    {customer.type === 'business' && customer.gstin && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                        {customer.gstin}
                      </p>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(customer.stage)}`}>
                      {customer.stage}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4 p-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => onEditCustomer(customer)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 touch-manipulation active:scale-98"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
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
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {customer.name}
                      </h3>
                      {customer.companyName && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {customer.companyName}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStageColor(customer.stage)}`}>
                      {customer.stage}
                    </span>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span className="capitalize">{customer.type}</span>
                    <span>{formatDate(customer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-500 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No customers found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Start adding customers to your database'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomersList;