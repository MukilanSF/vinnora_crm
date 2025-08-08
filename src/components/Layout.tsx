import React from 'react';
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
} from 'lucide-react';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'homepage' | 'leads' | 'customers' | 'deals' | 'billing' | 'deals-list' | 'support-tickets' | 'inventory';
  onTabChange: (tab: 'homepage' | 'leads' | 'customers' | 'deals' | 'billing' | 'deals-list' | 'support-tickets' | 'inventory') => void;
  onNewNote: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  currentUser: any;
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
  branding,
}) => {
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

  return (
    <div
      className="h-screen w-screen flex bg-gray-50 dark:bg-gray-900"
      style={branding?.themeColor ? { ['--theme-color' as any]: branding.themeColor } : {}}
    >
      {/* Sidebar */}
      <aside className="w-64 h-full bg-gradient-to-b from-[var(--theme-color)] to-orange-600 text-white flex flex-col shadow-xl overflow-y-auto">
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
              <p className="text-orange-100 text-sm">{brandTagline}</p>
              <p className="text-orange-100 text-xs">Selling is now fun, no more hassles.</p>
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
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-orange-100 hover:bg-white/10 hover:text-white'
                  }`}
                  type="button"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
            {/* Separator */}
            <div className="my-4 border-t border-orange-400"></div>
            {/* Support Tickets */}
            <button
              onClick={() => onTabChange('support-tickets')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'support-tickets'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-orange-100 hover:bg-white/10 hover:text-white'
              }`}
              type="button"
            >
              <Receipt className="w-5 h-5" />
              <span className="font-medium">Support Tickets</span>
            </button>
          </div>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
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
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'homepage' && 'Dashboard'}
                    {activeTab === 'deals-list' && 'Pipeline'}
                    {activeTab === 'deals' && 'Deals'}
                    {activeTab === 'customers' && 'Customers'}
                    {activeTab === 'billing' && 'Billing'}
                    {activeTab === 'inventory' && 'Inventory'}
                    {activeTab === 'support-tickets' && 'Support'}
                  </h2>
                  {activeTab === 'deals-list' && (
                    <p className="text-gray-600 text-sm">Drag and drop deals between stages</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold">
                  {currentUser?.fullName?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.fullName || 'admin'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{currentUser?.email || 'admin@vinnora.com'}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-300">Plan: {currentUser?.plan || 'free'}</p>
                </div>
              </div>
              <button
                onClick={onShowSettings}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                type="button"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                type="button"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-white text-gray-900">
          {children}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;