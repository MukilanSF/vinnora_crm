import React, { useState, useEffect } from 'react';
import {
  User, CreditCard, Users, Link, Shield, FileText, Database, Settings as SettingsIcon, Edit
} from 'lucide-react';
import UserManagement from './UserManagement';

interface SettingsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ activeSection, onSectionChange }) => {
  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: 'admin',
    email: 'admin@vinnora.com',
    company: 'vinnora',
    phone: '',
    address: '',
    plan: 'free'
  });

  // Branding state
  const [branding, setBranding] = useState({
    name: '',
    tagline: '',
    logo: null as File | null,
  });
  const [themeColor, setThemeColor] = useState('#2563eb');
  const [layout, setLayout] = useState('default');
  const [previewBranding, setPreviewBranding] = useState<null | {
    name: string;
    tagline: string;
    logo: File | null;
    themeColor: string;
    layout: string;
  }>(null);

  // Users state for User Management
  const [users, setUsers] = useState([
    { id: '1', name: 'Mukilan', email: 'mukilan@vinnora.com', role: 'Admin' },
    { id: '2', name: 'Selva', email: 'selva@vinnora.com', role: 'User' },
  ]);

  // Plan variable
  const plan = profileData.plan || 'free';

  // Handler for creating a new user
  const handleCreateUser = (user: { id: string; name: string; email: string; role: string }) => {
    setUsers(prev => [...prev, user]);
  };

  // Handler for logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBranding(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  // Render functions for each section
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Profile</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            value={profileData.company}
            onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address
        </label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          rows={4}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Enter your complete address"
        />
      </div>

      <button
        onClick={() => console.log('Saving profile changes:', profileData)}
        className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-600/25"
      >
        <span>Save Changes</span>
      </button>
    </div>
  );

  const renderBranding = () => (
    <div className="space-y-6 mt-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Branding</h2>
        <p className="text-gray-600 dark:text-gray-400">Personalize your CRM with your own brand</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
          {(previewBranding?.logo || branding.logo) && (
            <div className="mt-2">
              <img
                src={previewBranding?.logo
                  ? URL.createObjectURL(previewBranding.logo)
                  : branding.logo
                  ? URL.createObjectURL(branding.logo)
                  : ''}
                alt="Brand Logo"
                className="h-16 w-16 object-contain rounded bg-gray-100 dark:bg-gray-800 border"
              />
            </div>
          )}
        </div>
        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Name
          </label>
          <input
            type="text"
            value={previewBranding?.name ?? branding.name}
            onChange={e => setBranding(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your Company Name"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={previewBranding?.tagline ?? branding.tagline}
            onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
            placeholder="Your Brand Tagline"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          />
        </div>
        {/* Theme Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Color
          </label>
          <input
            type="color"
            value={previewBranding?.themeColor ?? themeColor}
            onChange={e => setThemeColor(e.target.value)}
            className="w-16 h-10 p-0 border-0 bg-transparent"
          />
        </div>
        {/* Layout Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Layout
          </label>
          <select
            value={previewBranding?.layout ?? layout}
            onChange={e => setLayout(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="default">Default</option>
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>
      </div>
      {/* Apply & Preview Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
          onClick={() => {
            // Apply previewed branding as actual branding
            if (previewBranding) {
              setBranding({
                name: previewBranding.name,
                tagline: previewBranding.tagline,
                logo: previewBranding.logo,
              });
              setThemeColor(previewBranding.themeColor);
              setLayout(previewBranding.layout);
              setPreviewBranding(null);
              document.documentElement.style.setProperty('--theme-color', previewBranding.themeColor);
            } else {
              document.documentElement.style.setProperty('--theme-color', themeColor);
            }
            // Show confirmation message
            window.alert('Changes Applied');
          }}
        >
          Apply
        </button>
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-all duration-200"
          onClick={() => {
            // Set previewBranding to current form values for preview
            setPreviewBranding({
              name: branding.name,
              tagline: branding.tagline,
              logo: branding.logo,
              themeColor,
              layout,
            });
          }}
        >
          Preview
        </button>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Subscription Plans</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose the plan that best fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Free Trial',
            price: '₹0',
            period: '/month',
            features: [
              'Up to 100 leads',
              'Basic CRM features',
              'Email support',
              '1 user'
            ],
            current: true,
            buttonText: 'Current Plan',
            buttonClass: 'bg-orange-600 text-white cursor-not-allowed'
          },
          {
            name: 'Starter',
            price: '₹999',
            period: '/month',
            features: [
              'Up to 1,000 leads',
              'Pipeline management',
              'Advanced analytics',
              'Up to 5 users'
            ],
            current: false,
            buttonText: 'Upgrade',
            buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white'
          },
          {
            name: 'Professional',
            price: '₹2,999',
            period: '/month',
            features: [
              'Unlimited leads',
              'Advanced automation',
              'API access',
              'Unlimited users',
              'Priority support'
            ],
            current: false,
            buttonText: 'Upgrade',
            buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white'
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            features: [
              'Everything in Professional',
              'Custom integrations',
              'Dedicated support',
              'Advanced security'
            ],
            current: false,
            buttonText: 'Contact Sales',
            buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white'
          }
        ].map((plan, index) => (
          <div
            key={plan.name}
            className={`bg-white dark:bg-gray-800 border rounded-xl p-6 ${
              plan.current 
                ? 'border-orange-300 ring-2 ring-orange-200 dark:border-orange-600 dark:ring-orange-600/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-orange-600">{plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${plan.buttonClass}`}
              disabled={plan.current}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Billing History Section */}
      <div className="space-y-6 mt-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Billing History</h2>
          <p className="text-gray-600 dark:text-gray-400">View your subscription billing history</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-400">No billing history available for free plan.</p>
        </div>
      </div>
    </div>
  );

  const renderDataManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Data Management</h2>
        <p className="text-gray-600 dark:text-gray-400">Import and export your CRM data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Data */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Data</h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Import data from external systems using CSV files. Field mapping will be available during import.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Entity Type
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>

            {csvFile && (
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  File selected: {csvFile.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Field mapping will be available in the next step
                </p>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Importing data...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleImportData}
              disabled={!csvFile || isImporting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                csvFile && !isImporting
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`}
            >
              {isImporting ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Export your CRM data to CSV format for backup or migration purposes.
          </p>

          <div className="space-y-4">
            {entities.map(entity => (
              <button
                key={entity.id}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{entity.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entity.fields.length} fields
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEntityManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Entity Management</h2>
        <p className="text-gray-600 dark:text-gray-400">View and modify entity fields and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entity Selection */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Entity</h3>
          <div className="space-y-2">
            {entities.map(entity => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(entity.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  selectedEntity === entity.id
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Database className="w-5 h-5" />
                <span className="font-medium">{entity.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Entity Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          {(() => {
            const entity = entities.find(e => e.id === selectedEntity);
            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {entity?.name} Fields
                  </h3>
                  <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Edit Fields</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {entity?.fields.map((field, index) => (
                    <div
                      key={field}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Field ID: {field}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Entity Configuration</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Entity ID:</span>
                      <span className="ml-2 font-mono text-blue-900 dark:text-blue-300">{entity?.id}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Total Fields:</span>
                      <span className="ml-2 font-mono text-blue-900 dark:text-blue-300">{entity?.fields.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <UserManagement
      users={users}
      plan={plan}
      onCreateUser={handleCreateUser}
    />
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Integrations</h2>
        <p className="text-gray-600 dark:text-gray-400">Connect with third-party services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Google Workspace</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Sync contacts and calendar</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Connect
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">WhatsApp Business</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Send messages to leads</p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Connect
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Security</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your account security settings</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add an extra layer of security</p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
            Enable 2FA
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Login Sessions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Manage active sessions</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Sign Out All Devices
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Privacy Policy</h2>
        <p className="text-gray-600 dark:text-gray-400">Data management and privacy settings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Export</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download all your data</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Export Data
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Permanently delete your account and data</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Content switcher
  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'branding': return renderBranding();
      case 'subscription': return renderSubscription();
      case 'data-management': return renderDataManagement();
      case 'entity-management': return renderEntityManagement();
      case 'users': return renderUserManagement();
      case 'integrations': return renderIntegrations();
      case 'security': return renderSecurity();
      case 'privacy': return renderPrivacyPolicy();
      default: return renderProfileSettings();
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
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6">
        <nav className="space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      {/* Settings Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;