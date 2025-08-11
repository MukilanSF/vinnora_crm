import React, { useState } from 'react';
import PaymentModal from '../PaymentModal';

interface SubscriptionSettingsProps {
  plan: string;
  highlightPlan?: string;
  onPlanUpgrade: (newPlan: string) => void;
}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = ({ plan, highlightPlan, onPlanUpgrade }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '₹0',
      period: '/month',
      features: [
        'Basic CRM',
        'Up to 100 leads',
        '1 user'
      ],
      current: plan === 'free',
      canUpgrade: false
    },
    {
      id: 'starter',
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
      canUpgrade: plan === 'free'
    },
    {
      id: 'professional',
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
      canUpgrade: plan === 'free' || plan === 'starter'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated support'
      ],
      current: plan === 'enterprise',
      canUpgrade: false
    }
  ];

  const handleUpgradeClick = (planToUpgrade: any) => {
    if (planToUpgrade.id === 'enterprise') {
      // Handle enterprise contact sales
      alert('Please contact our sales team for Enterprise pricing.');
      return;
    }
    setSelectedPlanForUpgrade(planToUpgrade);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (newPlan: string) => {
    onPlanUpgrade(newPlan);
    setShowPaymentModal(false);
    setSelectedPlanForUpgrade(null);
  };

  const getButtonText = (planItem: any) => {
    if (planItem.current) return 'Current Plan';
    if (planItem.id === 'enterprise') return 'Contact Sales';
    return 'Upgrade';
  };

  const getButtonClass = (planItem: any) => {
    if (planItem.current) {
      return 'bg-orange-600 text-white cursor-not-allowed';
    }
    if (planItem.id === 'enterprise') {
      return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
    return 'bg-orange-600 hover:bg-orange-700 text-white';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Subscription Plans</h2>
        <p className="text-gray-600 dark:text-gray-400">Choose the plan that best fits your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((planItem) => (
          <div
            key={planItem.name}
            className={`bg-white dark:bg-gray-800 border rounded-xl p-6 transition-all ${
              planItem.current 
                ? 'border-orange-300 ring-2 ring-orange-200 dark:border-orange-600 dark:ring-orange-600/20' 
                : highlightPlan === planItem.id
                ? 'border-blue-300 ring-2 ring-blue-200 dark:border-blue-600 dark:ring-blue-600/20 shadow-lg transform scale-105'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {highlightPlan === planItem.id && (
              <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full text-center mb-4">
                {planItem.id === 'professional' ? '🚀 Recommended Upgrade' : 'Recommended for you'}
              </div>
            )}
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
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${getButtonClass(planItem)}`}
              disabled={planItem.current}
              onClick={() => !planItem.current && handleUpgradeClick(planItem)}
            >
              {getButtonText(planItem)}
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

      {/* Payment Modal */}
      {showPaymentModal && selectedPlanForUpgrade && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedPlan={selectedPlanForUpgrade}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionSettings;
