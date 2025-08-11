import React from 'react';
import { Shield } from 'lucide-react';

interface IntegrationsSettingsProps {
  plan: string;
  onUpgrade?: (requiredPlan: string) => void;
}

const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({ plan, onUpgrade }) => {
  const isFreeTrialUser = plan === 'free';
  
  const integrations = [
    {
      name: 'Google Workspace',
      description: 'Sync contacts, calendar, and emails',
      icon: '🌐',
      category: 'Productivity',
      features: ['Contact sync', 'Calendar integration', 'Gmail integration']
    },
    {
      name: 'Microsoft Outlook',
      description: 'Connect Outlook emails and calendar',
      icon: '📧',
      category: 'Email',
      features: ['Email sync', 'Calendar sync', 'Contact management']
    },
    {
      name: 'Gmail',
      description: 'Direct Gmail integration for email tracking',
      icon: '✉️',
      category: 'Email',
      features: ['Email tracking', 'Auto-logging', 'Template sync']
    },
    {
      name: 'Microsoft Excel',
      description: 'Import/export data to Excel spreadsheets',
      icon: '📊',
      category: 'Data',
      features: ['Data export', 'Bulk import', 'Report generation']
    },
    {
      name: 'WhatsApp Business',
      description: 'Send messages and track conversations',
      icon: '💬',
      category: 'Communication',
      features: ['Message automation', 'Chat tracking', 'Lead nurturing']
    },
    {
      name: 'Slack',
      description: 'Get CRM notifications in Slack channels',
      icon: '💼',
      category: 'Communication',
      features: ['Deal notifications', 'Lead alerts', 'Team updates']
    },
    {
      name: 'Zapier',
      description: 'Connect with 1000+ apps via automation',
      icon: '⚡',
      category: 'Automation',
      features: ['Workflow automation', 'Data sync', 'Trigger actions']
    },
    {
      name: 'Mailchimp',
      description: 'Sync contacts for email marketing',
      icon: '📮',
      category: 'Marketing',
      features: ['Contact sync', 'Campaign tracking', 'Segmentation']
    },
    {
      name: 'Calendly',
      description: 'Schedule meetings with leads automatically',
      icon: '📅',
      category: 'Scheduling',
      features: ['Meeting automation', 'Lead qualification', 'Calendar sync']
    },
    {
      name: 'Twilio',
      description: 'SMS and voice calling integration',
      icon: '📱',
      category: 'Communication',
      features: ['SMS automation', 'Voice calls', 'Number tracking']
    },
    {
      name: 'HubSpot',
      description: 'Migrate data from HubSpot CRM',
      icon: '🔄',
      category: 'Migration',
      features: ['Data migration', 'Contact import', 'Deal transfer']
    },
    {
      name: 'Salesforce',
      description: 'Import data from Salesforce',
      icon: '☁️',
      category: 'Migration',
      features: ['Data migration', 'Field mapping', 'Record sync']
    }
  ];

  const categories = [...new Set(integrations.map(app => app.category))];

  return (
    <div className="space-y-6">
      {/* Plan Restriction Notice */}
      {isFreeTrialUser && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                Integrations Not Available
              </h3>
              <p className="text-orange-700 dark:text-orange-400">
                Integrations are available starting from the Starter plan. Upgrade to connect with your favorite apps.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => onUpgrade?.('starter')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Integration Categories */}
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category}</h3>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              {integrations.filter(app => app.category === category).length} apps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations
              .filter(app => app.category === category)
              .map(app => (
                <div
                  key={app.name}
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all ${
                    isFreeTrialUser ? 'opacity-75' : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {app.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {app.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {app.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Connect Button */}
                  <button
                    disabled={isFreeTrialUser}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isFreeTrialUser
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                        : app.category === 'Communication'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : app.category === 'Email'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : app.category === 'Data'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : app.category === 'Marketing'
                        ? 'bg-pink-600 hover:bg-pink-700 text-white'
                        : app.category === 'Automation'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : app.category === 'Scheduling'
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : app.category === 'Migration'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {isFreeTrialUser ? 'Upgrade Required' : 'Connect'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Integration Stats */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Integration Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {integrations.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Available Apps
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              0
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Connected
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {isFreeTrialUser ? 'Free' : 'Paid'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Plan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSettings;
