import React, { useState } from 'react';
import {
  User, CreditCard, Users, Link, Shield, FileText, Database, Settings as SettingsIcon, Edit, ArrowLeft, X
} from 'lucide-react';
import {
  ProfileSettings,
  BrandingSettings,
  SubscriptionSettings,
  DataManagementSettings,
  EntityManagementSettings,
  UserManagementSettings,
  IntegrationsSettings,
  SecuritySettings,
  PrivacyPolicySettings
} from './settings/index';

interface SettingsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  branding: {
    name: string;
    tagline: string;
    logo: File | null;
  };
  setBranding: (branding: any) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  layout: string;
  setLayout: (layout: string) => void;
  previewBranding: any;
  setPreviewBranding: (branding: any) => void;
  onClose: () => void;
  currentUser: any;
  activeBranding: any;
  onUserUpdate?: (userData: { name: string; email: string; plan: string }) => void;
  highlightPlan?: string;
  onPlanUpgrade?: (newPlan: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  activeSection, 
  onSectionChange, 
  branding, 
  setBranding, 
  themeColor, 
  setThemeColor, 
  setPreviewBranding, 
  onClose, 
  activeBranding,
  onUserUpdate,
  highlightPlan,
  onPlanUpgrade
}) => {
  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: 'admin',
    email: 'admin@vinnora.com',
    company: 'vinnora',
    phone: '',
    address: '',
    plan: 'free'
  });

  // Entity configurations with field types
  const entities = [
    {
      id: 'leads',
      name: 'Leads',
      fields: [
        { id: 'name', name: 'Name', type: 'String', required: true },
        { id: 'phone', name: 'Phone', type: 'Phone', required: true },
        { id: 'email', name: 'Email', type: 'Email', required: false },
        { id: 'location', name: 'Location', type: 'String', required: false },
        { id: 'serviceInterest', name: 'Service Interest', type: 'String', required: true },
        { id: 'source', name: 'Source', type: 'String', required: true },
        { id: 'stage', name: 'Stage', type: 'String', required: true },
        { id: 'id', name: 'ID', type: 'Id', required: true }
      ]
    },
    {
      id: 'customers',
      name: 'Customers',
      fields: [
        { id: 'name', name: 'Name', type: 'String', required: true },
        { id: 'email', name: 'Email', type: 'Email', required: false },
        { id: 'phone', name: 'Phone', type: 'Phone', required: true },
        { id: 'address', name: 'Address', type: 'String', required: false },
        { id: 'gstin', name: 'GSTIN', type: 'String', required: false },
        { id: 'companyName', name: 'Company Name', type: 'String', required: false },
        { id: 'type', name: 'Type', type: 'String', required: true },
        { id: 'id', name: 'ID', type: 'Id', required: true }
      ]
    },
    {
      id: 'deals',
      name: 'Deals',
      fields: [
        { id: 'dealName', name: 'Deal Name', type: 'String', required: true },
        { id: 'customerId', name: 'Customer ID', type: 'Id', required: true },
        { id: 'amount', name: 'Amount', type: 'Number', required: true },
        { id: 'currency', name: 'Currency', type: 'String', required: true },
        { id: 'expectedCloseDate', name: 'Expected Close Date', type: 'Date', required: true },
        { id: 'stage', name: 'Stage', type: 'String', required: true },
        { id: 'id', name: 'ID', type: 'Id', required: true }
      ]
    },
    {
      id: 'bills',
      name: 'Bills',
      fields: [
        { id: 'billNumber', name: 'Bill Number', type: 'String', required: true },
        { id: 'customerId', name: 'Customer ID', type: 'Id', required: true },
        { id: 'amount', name: 'Amount', type: 'Number', required: true },
        { id: 'currency', name: 'Currency', type: 'String', required: true },
        { id: 'date', name: 'Date', type: 'Date', required: true },
        { id: 'paymentStatus', name: 'Payment Status', type: 'String', required: true },
        { id: 'id', name: 'ID', type: 'Id', required: true }
      ]
    }
  ];

  // Users state for User Management
  const [users, setUsers] = useState([
    { id: '1', name: 'Mukilan', email: 'mukilan@vinnora.com', role: 'admin', active: true },
    { id: '2', name: 'Selva', email: 'selva@vinnora.com', role: 'sales-rep', active: true },
  ]);

  // Plan variable
  const plan = (profileData.plan as 'free' | 'starter' | 'professional' | 'enterprise') || 'free';

  // Handler for creating a new user
  const handleCreateUser = (user: { id: string; name: string; email: string; role: string; active: boolean }) => {
    setUsers(prev => [...prev, user]);
  };

  // State for highlighting specific plan during upgrade flow
  const [highlightedPlan, setHighlightedPlan] = useState<string | undefined>(highlightPlan);

  // Handler for plan upgrades - navigates to subscription with highlighted plan
  const handleUpgradeRequest = (requiredPlan: string) => {
    setHighlightedPlan(requiredPlan);
    onSectionChange('subscription');
    // The subscription page will show upgrade options based on current plan
    console.log(`Navigating to subscription page for ${requiredPlan} upgrade`);
  };
  // Content switcher
  const renderContent = () => {
    switch (activeSection) {
      case 'profile': 
        return <ProfileSettings 
          profileData={profileData} 
          setProfileData={setProfileData} 
          onUserUpdate={onUserUpdate}
          onUpgrade={handleUpgradeRequest}
        />;
      case 'branding': 
        return (
          <BrandingSettings 
            branding={branding} 
            setBranding={setBranding} 
            themeColor={themeColor} 
            setThemeColor={setThemeColor} 
            setPreviewBranding={setPreviewBranding}
            plan={plan}
            onUpgrade={handleUpgradeRequest}
          />
        );
      case 'subscription': 
        return <SubscriptionSettings plan={plan} highlightPlan={highlightedPlan || highlightPlan} onPlanUpgrade={onPlanUpgrade || (() => {})} />;
      case 'data-management': 
        return <DataManagementSettings entities={entities} plan={plan} onUpgrade={handleUpgradeRequest} />;
      case 'entity-management': 
        return <EntityManagementSettings entities={entities} plan={plan} onUpgrade={handleUpgradeRequest} />;
      case 'users': 
        return (
          <UserManagementSettings
            users={users}
            plan={plan}
            onCreateUser={handleCreateUser}
            onUpgrade={handleUpgradeRequest}
          />
        );
      case 'integrations': 
        return <IntegrationsSettings plan={plan} onUpgrade={handleUpgradeRequest} />;
      case 'security': 
        return <SecuritySettings />;
      case 'privacy': 
        return <PrivacyPolicySettings />;
      default: 
        return <ProfileSettings profileData={profileData} setProfileData={setProfileData} onUserUpdate={onUserUpdate} />;
    }
  };

  // Settings sections for sidebar
  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'branding', label: 'Branding', icon: Edit },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'data-management', label: 'Data Management', icon: Database },
    { id: 'entity-management', label: 'Entity Management', icon: SettingsIcon },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy Policy', icon: FileText }
  ];

  return (
    <div
      className="fixed inset-0 z-50 h-screen w-screen flex bg-gray-50 dark:bg-gray-900"
      style={activeBranding?.themeColor ? { ['--theme-color' as any]: activeBranding.themeColor } : {}}
    >
      {/* Sidebar */}
      <aside className="w-64 h-full bg-gradient-to-b from-[var(--theme-color)] to-orange-600 text-white flex flex-col shadow-lg overflow-y-auto">
        {/* Settings Header */}
        <div className="p-6 border-b border-orange-400">
          <div>
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-orange-100 text-sm">Configure your CRM</p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2 px-4">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-orange-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
          </div>
        </nav>
        
        {/* Back/Close Button */}
        <div className="mt-auto p-4 border-t border-orange-400">
          <button
            onClick={onClose}
            className="w-full flex items-center space-x-3 px-4 py-3 text-orange-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to CRM</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--theme-color)] to-orange-600 rounded-lg flex items-center justify-center">
                {(() => {
                  const section = settingsSections.find(s => s.id === activeSection);
                  const Icon = section?.icon || SettingsIcon;
                  return <Icon className="w-4 h-4 text-white" />;
                })()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {settingsSections.find(s => s.id === activeSection)?.label || 'Settings'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {activeSection === 'profile' && 'Manage your account information'}
                  {activeSection === 'branding' && 'Customize your CRM appearance'}
                  {activeSection === 'subscription' && 'Manage your subscription plan'}
                  {activeSection === 'data-management' && 'Import and export data'}
                  {activeSection === 'entity-management' && 'Configure entity fields'}
                  {activeSection === 'users' && 'Manage team members'}
                  {activeSection === 'integrations' && 'Connect third-party services'}
                  {activeSection === 'security' && 'Security and authentication'}
                  {activeSection === 'privacy' && 'Privacy and data policies'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;