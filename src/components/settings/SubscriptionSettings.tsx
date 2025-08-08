import React from 'react';

interface SubscriptionSettingsProps {
  plan: string;
}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ plan }) => {
  return (
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
              'Basic CRM',
              'Up to 100 leads',
              '1 user'
            ],
            current: plan === 'free',
            buttonText: 'Current Plan',
            buttonClass: 'bg-orange-600 text-white cursor-not-allowed'
          },
          {
            name: 'Starter',
            price: '₹2,999',
            period: '/month',
            features: [
              'Up to 1,000 leads',
              'Email & Automation',
              'Download Invoices & Reports',
              'Data Import/Export',
              'Third-party app Integration',
              'Up to 5 users'
            ],
            current: plan === 'starter',
            buttonText: plan === 'starter' ? 'Current Plan' : 'Upgrade',
            buttonClass: plan === 'starter' ? 'bg-orange-600 text-white cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'
          },
          {
            name: 'Professional',
            price: '₹6,999',
            period: '/month',
            features: [
              'Unlimited leads',
              'Personal Branding and Theme',
              'Create custom Entities',
              'API access',
              'Up to 25 users'
            ],
            current: plan === 'professional',
            buttonText: plan === 'professional' ? 'Current Plan' : 'Upgrade',
            buttonClass: plan === 'professional' ? 'bg-orange-600 text-white cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'
          },
          {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            features: [
              'Everything in Professional',
              'Custom integrations',
              'Dedicated support'
            ],
            current: plan === 'enterprise',
            buttonText: plan === 'enterprise' ? 'Current Plan' : 'Contact Sales',
            buttonClass: plan === 'enterprise' ? 'bg-orange-600 text-white cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }
        ].map((planItem) => (
          <div
            key={planItem.name}
            className={`bg-white dark:bg-gray-800 border rounded-xl p-6 ${
              planItem.current 
                ? 'border-orange-300 ring-2 ring-orange-200 dark:border-orange-600 dark:ring-orange-600/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{planItem.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-orange-600">{planItem.price}</span>
                <span className="text-gray-600 dark:text-gray-400">{planItem.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {planItem.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${planItem.buttonClass}`}
              disabled={planItem.current}
            >
              {planItem.buttonText}
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
          <p className="text-gray-600 dark:text-gray-400">
            {plan === 'free' ? 'No billing history available for free plan.' : 'Your billing history will appear here.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
