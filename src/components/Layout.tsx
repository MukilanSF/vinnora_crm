import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Handshake,
  Receipt,
  Plus,
  Settings,
  LogOut,
  TrendingUp,
  Box,
  Menu,
  X,
  Bell,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Logo from './Logo';
import PlanStatusBadge from './PlanStatusBadge';
import { notificationService, NotificationEvent } from '../utils/notificationService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'homepage' | 'leads' | 'customers' | 'deals' | 'billing' | 'deals-list' | 'support-tickets' | 'inventory';
  onTabChange: (tab: 'homepage' | 'leads' | 'customers' | 'deals' | 'billing' | 'deals-list' | 'support-tickets' | 'inventory') => void;
  onNewNote: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  currentUser: any;
  onAddCustomer?: () => void;
  onAddDeal?: () => void;
  onAddBill?: () => void;
  onAddInventory?: () => void;
  onAddTicket?: () => void;
  notifications?: NotificationEvent[];
  onNotificationToggle?: () => void;
  showNotifications?: boolean;
  tickets?: any[];
  branding?: {
    name: string;
    tagline: string;
    logo: File | null;
    themeColor: string;
    layout: string;
  };
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onNewNote,
  onShowSettings,
  onLogout,
  currentUser,
  onAddCustomer,
  onAddDeal,
  onAddBill,
  onAddInventory,
  onAddTicket,
  notifications = [],
  onNotificationToggle,
  showNotifications = false,
  tickets = [],
  branding,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'homepage' as const, label: 'Homepage', icon: LayoutDashboard },
    { id: 'deals-list' as const, label: 'Pipeline', icon: TrendingUp },
    { id: 'customers' as const, label: 'Customers', icon: UserCheck },
    { id: 'deals' as const, label: 'Deals', icon: Handshake },
    { id: 'billing' as const, label: 'Billing', icon: Receipt },
    { id: 'inventory' as const, label: 'Inventory', icon: Box },
  ];

  const brandName = branding?.name || 'Vinnora CRM';
  const brandTagline = branding?.tagline || 'Built in India, for Indians';
  const brandLogoUrl = branding?.logo
    ? URL.createObjectURL(branding.logo)
    : undefined;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div
      className="h-screen w-screen flex bg-gray-50 dark:bg-gray-900"
      style={branding?.themeColor ? { ['--theme-color' as any]: branding.themeColor } : {}}
    >
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[var(--theme-color)] to-orange-600 text-white flex flex-col shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-orange-400">
          <div className="flex items-center space-x-3">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt="Brand Logo" className="w-8 h-8 rounded bg-white object-contain" />
            ) : (
              <Logo className="w-8 h-8 text-white" />
            )}
            <div>
              <h1 className="text-lg font-bold">{brandName}</h1>
              <p className="text-orange-100 text-sm hidden sm:block">{brandTagline}</p>
              <p className="text-orange-100 text-xs hidden sm:block">Selling is now fun, no more hassles.</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    closeMobileMenu();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 touch-manipulation ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-orange-100 hover:bg-white/10 hover:text-white active:bg-white/20'
                  }`}
                  type="button"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
            {/* Separator */}
            <div className="my-4 border-t border-orange-400"></div>
            {/* Support Tickets */}
            <button
              onClick={() => {
                onTabChange('support-tickets');
                closeMobileMenu();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 touch-manipulation ${
                activeTab === 'support-tickets'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-orange-100 hover:bg-white/10 hover:text-white active:bg-white/20'
              }`}
              type="button"
            >
              <Receipt className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Support Tickets</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full lg:ml-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex-1 lg:flex-none">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--theme-color)] to-orange-600 rounded-lg flex items-center justify-center">
                  {activeTab === 'homepage' && <LayoutDashboard className="w-4 h-4 text-white" />}
                  {activeTab === 'deals-list' && <TrendingUp className="w-4 h-4 text-white" />}
                  {activeTab === 'deals' && <Handshake className="w-4 h-4 text-white" />}
                  {activeTab === 'customers' && <UserCheck className="w-4 h-4 text-white" />}
                  {activeTab === 'billing' && <Receipt className="w-4 h-4 text-white" />}
                  {activeTab === 'inventory' && <Box className="w-4 h-4 text-white" />}
                  {activeTab === 'support-tickets' && <Receipt className="w-4 h-4 text-white" />}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {activeTab === 'homepage' && 'Dashboard'}
                      {activeTab === 'deals-list' && 'Pipeline'}
                      {activeTab === 'deals' && 'Deals'}
                      {activeTab === 'customers' && 'Customers'}
                      {activeTab === 'billing' && 'Billing'}
                      {activeTab === 'inventory' && 'Inventory'}
                      {activeTab === 'support-tickets' && 'Support'}
                    </h2>
                    
                    {/* Action Buttons next to title */}
                    {activeTab === 'customers' && onAddCustomer && (
                      <button
                        onClick={onAddCustomer}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Customer</span>
                      </button>
                    )}
                    {activeTab === 'deals' && onAddDeal && (
                      <button
                        onClick={onAddDeal}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Deal</span>
                      </button>
                    )}
                    {activeTab === 'billing' && onAddBill && (
                      <button
                        onClick={onAddBill}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Bill</span>
                      </button>
                    )}
                    {activeTab === 'inventory' && onAddInventory && (
                      <button
                        onClick={onAddInventory}
                        className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Inventory</span>
                      </button>
                    )}
                    {activeTab === 'support-tickets' && onAddTicket && (
                      <button
                        onClick={onAddTicket}
                        className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>New Ticket</span>
                      </button>
                    )}
                  </div>
                  {activeTab === 'deals-list' && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Drag and drop deals between stages</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Support Notifications */}
              <div className="relative">
                <button
                  onClick={onNotificationToggle}
                  className="relative p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Support Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Support Notifications</h3>
                      <button
                        onClick={onNotificationToggle}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <div key={index} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notification.type === 'escalated' || notification.type === 'overdue' ? (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                ) : (
                                  <Bell className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Ticket #{notification.ticketId} - {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {currentUser?.fullName?.[0]?.toUpperCase() || currentUser?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.fullName || currentUser?.name || 'admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{currentUser?.email || 'admin@vinnora.com'}</p>
                  <div className="mt-1">
                    <PlanStatusBadge plan={currentUser?.plan || 'free'} />
                  </div>
                </div>
              </div>
              <button
                onClick={onShowSettings}
                className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                type="button"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-2 sm:px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                type="button"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;