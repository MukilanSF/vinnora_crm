import React, { useState } from 'react';
import { Search, Filter, Plus, Handshake, Calendar, IndianRupee, User, TrendingUp } from 'lucide-react';
import { Deal } from '../utils/types';
import SearchBar from './SearchBar'; // Import your SearchBar component

interface DealsListProps {
  deals: Deal[];
  onAddDeal: () => void;
  onEditDeal: (deal: Deal) => void;
  activeTab: string; // Add activeTab prop
  customers: any[]; // Add customers prop
  setSelectedCustomer: (customer: any) => void; // Add setSelectedCustomer prop
  setIsCustomerDetailOpen: (open: boolean) => void; // Add setIsCustomerDetailOpen prop
}

const DealsList: React.FC<DealsListProps> = ({ deals, onAddDeal, onEditDeal, activeTab, customers, setSelectedCustomer, setIsCustomerDetailOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<'all' | Deal['stage']>('all');

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

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
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Deals Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your deals and opportunities</p>
        </div>
        <button
          onClick={onAddDeal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deal</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value as any)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stages</option>
            <option value="proposal">Prospecting</option>
            <option value="negotiation">Qualification</option>
            <option value="deal-closed">Deals Closed</option>
            <option value="deal-lost">Deals Lost</option>
          </select>
        </div>
      </div>

      {/* Deals List */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expected Close
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDeals.map((deal) => (
                <tr
                  key={deal.id}
                  onClick={() => onEditDeal(deal)}
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                        <Handshake className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {deal.dealName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          ID: {deal.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {deal.customerName}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(deal.amount)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                      {getStageLabel(deal.stage)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(deal.expectedCloseDate)}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-500">
                    {deal.assignedTo || 'Unassigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-500 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deals found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'Start creating deals for your customers'}
          </p>
        </div>
      )}

      {/* Customers Tab - Search Bar */}
      {activeTab === 'customers' && (
        <div className="mb-6">
          <SearchBar
            placeholder="Search customers..."
            data={customers}
            filter={(customer, query) =>
              customer.name.toLowerCase().includes(query.toLowerCase()) ||
              customer.email?.toLowerCase().includes(query.toLowerCase()) ||
              customer.phone?.includes(query)
            }
            onSelect={customer => {
              setSelectedCustomer(customer);
              setIsCustomerDetailOpen(true);
            }}
            display={customer => (
              <div>
                <span className="font-semibold">{customer.name}</span>
                <span className="ml-2 text-xs text-gray-500">{customer.email}</span>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default DealsList;