import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertCircle, Clock, CheckCircle, XCircle, Users, TrendingUp } from 'lucide-react';
import { SupportTicket, Customer } from '../utils/types';
import { notificationService } from '../utils/notificationService';
import SearchBar from './SearchBar';

interface SupportTicketsProps {
  tickets: SupportTicket[];
  onAddTicket: () => void;
  onEditTicket: (ticket: SupportTicket) => void;
  activeTab: string; // <-- add this line
}

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-600',
  'in progress': 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-blue-100 text-blue-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const SupportTickets: React.FC<SupportTicketsProps> = ({ tickets, onAddTicket, onEditTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | SupportTicket['status']>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | SupportTicket['priority']>('all');
  const [slaReport, setSlaReport] = useState<any>(null);

  // Initialize SLA report and check for escalations
  useEffect(() => {
    // Check for escalations on component mount and every 5 minutes
    const checkEscalations = () => {
      const escalatedTickets = notificationService.checkEscalation(tickets);
      if (escalatedTickets.length > 0) {
        console.log(`${escalatedTickets.length} tickets escalated`, escalatedTickets);
      }
      
      // Generate SLA report
      setSlaReport(notificationService.generateSLAReport(tickets));
    };

    checkEscalations();
    const interval = setInterval(checkEscalations, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, [tickets]);

  // Handle ticket click with notification tracking
  const handleTicketClick = async (ticket: SupportTicket) => {
    // Create notification for ticket view
    await notificationService.createNotification(ticket, 'updated', { action: 'viewed' });
    onEditTicket(ticket);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in-progress': return Clock;
      case 'resolved': return CheckCircle;
      case 'closed': return XCircle;
      default: return AlertCircle;
    }
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

  return (
    <div className="support-tickets-section space-y-6">
      {/* Enhanced Header with SLA Stats */}
      <div className="section-header flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
        </div>
        
        {/* SLA Quick Stats */}
        {slaReport && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Avg Resolution: {Math.round(slaReport.averageResolutionTime)}h</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-gray-600">Overdue: {slaReport.overdueTickets}</span>
            </div>
          </div>
        )}
      </div>

      {/* SLA Dashboard */}
      {slaReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tickets</p>
                <p className="text-xl font-bold text-blue-900">{slaReport.totalTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">Avg Resolution</p>
                <p className="text-xl font-bold text-green-900">{Math.round(slaReport.averageResolutionTime)}h</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600 font-medium">Overdue</p>
                <p className="text-xl font-bold text-orange-900">{slaReport.overdueTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-red-600 font-medium">Escalated</p>
                <p className="text-xl font-bold text-red-900">{slaReport.escalatedTickets}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-row flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <table className="tickets-table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ticket.contactId || 'Not specified'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-600'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'numeric', year: 'numeric' }).format(new Date(ticket.createdAt))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'numeric', year: 'numeric' }).format(new Date(ticket.updatedAt))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTickets;