import React, { useState } from 'react';
import { Plus, Search, Filter, IndianRupee, Calendar, User, TrendingUp } from 'lucide-react';
import { Deal } from '../utils/types';

interface DealsPipelineProps {
  deals: Deal[];
  onStageChange: (dealId: string, newStage: Deal['stage']) => void;
  onAddDeal: () => void;
}

const DealsPipeline: React.FC<DealsPipelineProps> = ({ deals, onStageChange, onAddDeal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const stages: { id: Deal['stage']; label: string; color: string }[] = [
    { id: 'proposal', label: 'Prospecting', color: 'border-blue-300 bg-blue-50 dark:bg-blue-500/10' },
    { id: 'negotiation', label: 'Qualification', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-500/10' },
    { id: 'deal-closed', label: 'Deals Closed', color: 'border-green-300 bg-green-50 dark:bg-green-500/10' },
    { id: 'deal-lost', label: 'Deals Lost', color: 'border-red-300 bg-red-50 dark:bg-red-500/10' },
  ];

  const allStages = [...stages];

  const filteredDeals = deals.filter(deal => 
    deal.dealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDealsByStage = (stage: Deal['stage']) => {
    return filteredDeals.filter(deal => deal.stage === stage);
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
      day: 'numeric'
    }).format(date);
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: Deal['stage']) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    onStageChange(dealId, newStage);
  };

  // Calculate pipeline stats
  const totalPipeline = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const revenueWon = deals.filter(d => d.stage === 'deal-closed').reduce((sum, deal) => sum + deal.amount, 0);
  const activeDeals = deals.filter(d => !['deal-closed', 'deal-lost'].includes(d.stage)).length;
  const dealsClosedPercentage = deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'deal-closed').length / deals.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Pipeline</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{formatCurrency(totalPipeline)}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">{deals.length} deals</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Revenue Won</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-300">{formatCurrency(revenueWon)}</p>
              <p className="text-xs text-green-600 dark:text-green-400">0 deals</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">Active Deals</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{activeDeals}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">In progress</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Deals Closed</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{dealsClosedPercentage}%</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Percentage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={onAddDeal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deal</span>
        </button>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-x-auto">
        {allStages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.amount, 0);
          
          return (
            <div
              key={stage.id}
              className={`min-h-96 rounded-lg border-2 border-dashed p-4 ${stage.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{stage.label}</h3>
                  <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded-full text-xs font-medium">
                    {stageDeals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{formatCurrency(stageValue)}</p>
              </div>
              
              <div className="space-y-3">
                {stageDeals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Drop deals here</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-move hover:scale-[1.02]"
                    >
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{deal.dealName}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{deal.customerName}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="w-3 h-3" />
                          <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(deal.amount)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(deal.expectedCloseDate)}</span>
                        </div>
                      </div>
                      
                      {deal.assignedTo && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                          <User className="w-3 h-3" />
                          <span>Assigned</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tip */}
      <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Pro Tip:</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Drag deals between columns to update their stage. Changes are saved automatically!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-right">
        <p className="text-xs text-gray-500 dark:text-gray-400"></p>
      </div>
    </div>
  );
};

export default DealsPipeline;