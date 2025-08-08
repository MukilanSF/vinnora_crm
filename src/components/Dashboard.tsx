import React, { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Users, UserCheck, Handshake, IndianRupee, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { DashboardStats, Reminder, Lead, Deal } from '../utils/types';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, ArcElement);

interface DashboardProps {
  stats: DashboardStats;
  reminders: Reminder[];
  recentLeads: Lead[];
  recentDeals: Deal[];
  onReminderComplete: (id: string) => void;
  plan: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  reminders, 
  recentLeads, 
  recentDeals, 
  onReminderComplete,
  plan
}) => {
  const pendingReminders = reminders.filter(r => !r.completed);
  const [selectedReport, setSelectedReport] = useState<string>('');
  
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
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'interested': return 'bg-green-100 text-green-800';
      case 'proposal-sent': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'deal-closed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Example data for charts (replace with real data as needed)
  const dealsFunnelData = {
    labels: ['New', 'Contacted', 'Qualified', 'Won', 'Lost'],
    datasets: [
      {
        label: 'Deals',
        data: [stats.newDeals, stats.contactedDeals, stats.qualifiedDeals, stats.wonDeals, stats.lostDeals],
        backgroundColor: [
          '#2563eb', '#22d3ee', '#10b981', '#16a34a', '#ef4444'
        ],
      },
    ],
  };

  const revenueTrendData = {
    labels: stats.revenueMonths,
    datasets: [
      {
        label: 'Revenue',
        data: stats.revenueValues,
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.4,
      },
    ],
  };

  const ticketsData = {
    labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Support Tickets',
        data: [stats.openTickets, stats.inProgressTickets, stats.resolvedTickets, stats.closedTickets],
        backgroundColor: ['#f59e42', '#fbbf24', '#10b981', '#64748b'],
      },
    ],
  };

  // Downloadable report handler
  const handleDownloadReport = () => {
    // Mock: Replace with real report generation/download logic
    const csv = 'Report,Value\nTotal Revenue,100000\nTotal Deals,50\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Download CSV Button Row */}
      <div className="flex justify-end">
        {plan !== 'free' ? (
          <button
            onClick={handleDownloadReport}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Download CSV Report
          </button>
        ) : (
          <button
            disabled
            className="flex items-center px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            title="Upgrade to download reports"
          >
            <Download className="w-5 h-5 mr-2" />
            Download CSV Report
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLeads}</p>
              <p className="text-blue-700 text-sm">Total Leads</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
              <p className="text-green-700 text-sm">Customers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Handshake className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalDeals}</p>
              <p className="text-purple-700 text-sm">Active Deals</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <IndianRupee className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-emerald-700 text-sm">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-orange-600" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.pendingFollowUps}</p>
              <p className="text-gray-600 text-sm">Pending Follow-ups</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.dealsThisMonth}</p>
              <p className="text-gray-600 text-sm">Deals This Month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xl font-semibold text-gray-900">{stats.conversionRate}%</p>
              <p className="text-gray-600 text-sm">Deals Closed %</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Reminders */}
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Today's Reminders</h3>
          </div>
          
          <div className="space-y-4">
            {pendingReminders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                All caught up! No pending reminders.
              </p>
            ) : (
              pendingReminders.slice(0, 5).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => onReminderComplete(reminder.id)}
                    className="mt-1 w-5 h-5 border-2 border-blue-600 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{reminder.entityName}</p>
                    <p className="text-gray-700 text-sm">{reminder.message}</p>
                    <p className="text-gray-500 text-xs mt-1 capitalize">
                      {reminder.entityType} • {formatDate(reminder.date)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Leads</h3>
          </div>
          
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200/50 hover:bg-gray-100/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{lead.name}</p>
                    <p className="text-gray-600 text-sm">{lead.serviceInterest}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                    {lead.stage.replace('-', ' ')}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(lead.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <Bar data={dealsFunnelData} options={{ plugins: { legend: { display: false } } }} />
        </div>
        {/* Revenue Trends */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
          <Line data={revenueTrendData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Support Tickets Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Support Tickets Status</h3>
          <Doughnut data={ticketsData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;