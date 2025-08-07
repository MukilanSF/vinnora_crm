import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Lead } from '../utils/types';

interface LeadsPipelineProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: Lead['stage']) => void;
  onAddLead: () => void;
}

const LeadsPipeline: React.FC<LeadsPipelineProps> = ({ leads, onStageChange, onAddLead }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const stages: { id: Lead['stage']; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'bg-blue-100 border-blue-300 dark:bg-blue-500/20 dark:border-blue-500/30' },
    { id: 'contacted', label: 'Contacted', color: 'bg-yellow-100 border-yellow-300 dark:bg-yellow-500/20 dark:border-yellow-500/30' },
    { id: 'interested', label: 'Interested', color: 'bg-green-100 border-green-300 dark:bg-green-500/20 dark:border-green-500/30' },
    { id: 'proposal-sent', label: 'Proposal Sent', color: 'bg-purple-100 border-purple-300 dark:bg-purple-500/20 dark:border-purple-500/30' },
    { id: 'deal-closed', label: 'Deal Closed', color: 'bg-emerald-100 border-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-500/30' },
    { id: 'lost', label: 'Lost', color: 'bg-red-100 border-red-300 dark:bg-red-500/20 dark:border-red-500/30' }
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.serviceInterest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const getLeadsByStage = (stage: Lead['stage']) => {
    return filteredLeads.filter(lead => lead.stage === stage);
  };

  const sources = Array.from(new Set(leads.map(lead => lead.source)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: Lead['stage']) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    onStageChange(leadId, newStage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Leads Pipeline</h2>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your leads through the sales process</p>
        </div>
        <button
          onClick={onAddLead}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6 overflow-x-auto">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          
          return (
            <div
              key={stage.id}
              className={`min-h-96 rounded-2xl border-2 border-dashed p-4 ${stage.color}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{stage.label}</h3>
                <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 rounded-full text-sm font-medium">
                  {stageLeads.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-move hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{lead.name}</h4>
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{lead.serviceInterest}</p>
                    
                    <div className="space-y-2 text-xs text-gray-500 dark:text-gray-500">
                      {lead.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{lead.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {lead.source}
                      </span>
                      {lead.nextFollowUp && (
                        <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(lead.nextFollowUp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadsPipeline;