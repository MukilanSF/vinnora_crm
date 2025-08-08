import React, { useState, useEffect } from 'react';
import {
  User, CreditCard, Users, Link, Shield, FileText, Database, Settings as SettingsIcon, Edit, ArrowLeft, X, Download, Upload, Eye, Save, Plus
} from 'lucide-react';
import UserManagement from './UserManagement';
import Logo from './Logo';

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
}

const Settings: React.FC<SettingsProps> = ({ 
  activeSection, 
  onSectionChange, 
  branding, 
  setBranding, 
  themeColor, 
  setThemeColor, 
  layout, 
  setLayout, 
  previewBranding, 
  setPreviewBranding, 
  onClose, 
  currentUser, 
  activeBranding 
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

  // Data Management state
  const [selectedEntity, setSelectedEntity] = useState('leads');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Entity configurations with field types
  const [entities, setEntities] = useState([
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
  ]);

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

  // Handler for file upload in data management
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Handler for import data
  const handleImportData = async () => {
    if (!csvFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsImporting(false);
    setCsvFile(null);
    alert('Data imported successfully!');
  };

  // Handler for export data
  const handleExportData = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;
    
    // Create CSV headers
    const headers = entity.fields.map(field => field.name).join(',');
    const csvContent = `${headers}\n`;
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entity.name.toLowerCase()}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handler for field editing
  const handleFieldEdit = (entityId: string, fieldId: string, updates: any) => {
    setEntities(entities.map(entity => 
      entity.id === entityId 
        ? {
            ...entity,
            fields: entity.fields.map(field => 
              field.id === fieldId ? { ...field, ...updates } : field
            )
          }
        : entity
    ));
  };
  // Render functions for each section
  const renderProfileSettings = () => (
    <div className="space-y-6">
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
    <div className="space-y-6">
      {/* Preview Section */}
      {previewBranding && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">Preview</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {previewBranding.logo ? (
                <img
                  src={URL.createObjectURL(previewBranding.logo)}
                  alt="Preview Logo"
                  className="w-8 h-8 rounded bg-white object-contain"
                />
              ) : (
                <Logo className="w-8 h-8" style={{ color: previewBranding.themeColor }} />
              )}
              <div>
                <h1 className="text-lg font-bold" style={{ color: previewBranding.themeColor }}>
                  {previewBranding.name || 'Your Brand Name'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {previewBranding.tagline || 'Your tagline here'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Logo
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {branding.logo ? (
                    <img
                      src={URL.createObjectURL(branding.logo)}
                      alt="Brand Logo"
                      className="h-16 w-16 object-contain rounded mb-2"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> your logo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or SVG (MAX. 2MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
            {branding.logo && (
              <button
                onClick={() => setBranding(prev => ({ ...prev, logo: null }))}
                className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Remove Logo
              </button>
            )}
          </div>
        </div>
        
        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Name
          </label>
          <input
            type="text"
            value={branding.name}
            onChange={e => setBranding(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your Company Name"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={branding.tagline}
            onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
            placeholder="Your Brand Tagline"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        {/* Theme Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={themeColor}
              onChange={e => setThemeColor(e.target.value)}
              className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={themeColor}
              onChange={e => setThemeColor(e.target.value)}
              placeholder="#2563eb"
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Apply & Preview Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
          onClick={() => {
            setPreviewBranding({
              name: branding.name,
              tagline: branding.tagline,
              logo: branding.logo,
              themeColor,
              layout,
            });
          }}
        >
          <Eye className="w-4 h-4" />
          <span>Preview Changes</span>
        </button>
        <button
          className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange-600/25"
          onClick={() => {
            document.documentElement.style.setProperty('--theme-color', themeColor);
            setPreviewBranding(null);
            alert('Branding changes applied successfully!');
          }}
        >
          <Save className="w-4 h-4" />
          <span>Apply Changes</span>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Entity to Export
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => handleExportData(selectedEntity)}
              className="w-full flex items-center justify-center space-x-2 p-4 bg-green-50 dark:bg-green-500/10 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors border border-green-200 dark:border-green-500/20"
            >
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className="font-medium text-green-900 dark:text-green-300">
                  Export {entities.find(e => e.id === selectedEntity)?.name}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  {entities.find(e => e.id === selectedEntity)?.fields.length} fields
                </p>
              </div>
              <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEntityManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          {selectedEntity && (() => {
            const entity = entities.find(e => e.id === selectedEntity);
            if (!entity) return <div>Entity not found</div>;
            
            return (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {entity.name} Fields
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage fields and their properties for {entity.name.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        const newField = {
                          id: `field_${Date.now()}`,
                          name: 'New Field',
                          type: 'String' as const,
                          required: false
                        };
                        handleFieldEdit(entity.id, 'add', newField);
                      }}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Field</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                      <Save className="w-4 h-4" />
                      <span>Save Configuration</span>
                    </button>
                  </div>
                </div>

                {/* Fields List */}
                <div className="space-y-3">
                  {entity.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        {editingField === field.id ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => handleFieldEdit(entity.id, field.id, { name: e.target.value })}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <select
                              value={field.type}
                              onChange={(e) => handleFieldEdit(entity.id, field.id, { type: e.target.value })}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                              <option value="String">String</option>
                              <option value="Number">Number</option>
                              <option value="Phone">Phone</option>
                              <option value="Email">Email</option>
                              <option value="Date">Date</option>
                              <option value="Id">ID (Unique)</option>
                            </select>
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => handleFieldEdit(entity.id, field.id, { required: e.target.checked })}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Required</span>
                            </label>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {field.name}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </p>
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                                {field.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Field ID: {field.id}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {editingField === field.id ? (
                          <button 
                            onClick={() => setEditingField(null)}
                            className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => setEditingField(field.id)}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this field?')) {
                              handleFieldEdit(entity.id, field.id, 'delete');
                            }
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Entity Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">Total Fields</h4>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{entity.fields.length}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                    <h4 className="font-medium text-green-900 dark:text-green-300 mb-1">Required Fields</h4>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                      {entity.fields.filter(f => f.required).length}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg">
                    <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-1">Unique Fields</h4>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                      {entity.fields.filter(f => f.type === 'Id').length}
                    </p>
                  </div>
                </div>

                {/* Entity Configuration */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Entity Configuration</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Entity ID:</span>
                      <span className="ml-2 font-mono text-blue-900 dark:text-blue-300">{entity.id}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-400">Total Fields:</span>
                      <span className="ml-2 font-mono text-blue-900 dark:text-blue-300">{entity.fields.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })() || (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select an Entity</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose an entity from the sidebar to view and manage its fields</p>
            </div>
          )}
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
    <div
      className="h-screen w-screen flex bg-gray-50 dark:bg-gray-900"
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