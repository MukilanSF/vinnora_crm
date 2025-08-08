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

  // Use branding or fallback to defaults
  const brandName = branding?.name || 'Vinnora CRM';
  const brandTagline = branding?.tagline || 'Built in India, for Indians';
  const brandLogoUrl = branding?.logo
    ? URL.createObjectURL(branding.logo)
    : undefined;

  // Optionally, you can use branding.themeColor for inline styles or let the CSS variable handle it

  return (
    <div className="min-h-screen bg-gray-50 flex" style={branding?.themeColor ? { ['--theme-color' as any]: branding.themeColor } : {}}>
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[var(--theme-color)] to-orange-600 text-white flex flex-col">
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
                  // Allow navigation from Settings page as well
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
        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-orange-400">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {currentUser?.fullName?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{currentUser?.fullName || 'admin'}</p>
              <p className="text-xs text-orange-100">{currentUser?.email || 'admin@vinnora.com'}</p>
              <p className="text-xs text-orange-200">Plan: {currentUser?.plan || 'free'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button 
              onClick={onShowSettings}
              className="w-full flex items-center space-x-3 px-4 py-2 text-orange-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              type="button"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-orange-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              type="button"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'homepage' && 'Sales Homepage'}
                {activeTab === 'deals-list' && 'Selling Pipeline'}
                {activeTab === 'deals' && 'Deals Management'}
                {activeTab === 'customers' && 'Customers Management'}
                {activeTab === 'billing' && 'Billing Management'}
                {activeTab === 'inventory' && 'Inventory'}
                {activeTab === 'support-tickets' && 'Support Tickets'}
              </h2>
              {activeTab === 'deals-list' && (
                <p className="text-gray-600 text-sm">Drag and drop deals between stages</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-white text-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;