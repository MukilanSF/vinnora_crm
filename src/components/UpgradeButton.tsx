import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';

interface UpgradeButtonProps {
  currentPlan: 'free' | 'starter' | 'professional' | 'enterprise';
  requiredPlan: 'starter' | 'professional' | 'enterprise';
  onUpgrade: (requiredPlan: string) => void;
  feature?: string;
  className?: string;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ 
  currentPlan, 
  requiredPlan, 
  onUpgrade, 
  feature = 'this feature',
  className = ''
}) => {
  const planHierarchy = ['free', 'starter', 'professional', 'enterprise'];
  const currentPlanIndex = planHierarchy.indexOf(currentPlan);
  const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
  
  const needsUpgrade = currentPlanIndex < requiredPlanIndex;

  if (!needsUpgrade) {
    return null;
  }

  const planLabels = {
    starter: 'Starter',
    professional: 'Professional', 
    enterprise: 'Enterprise'
  };

  const planPrices = {
    starter: '₹2,999',
    professional: '₹6,999',
    enterprise: 'Custom'
  };

  return (
    <div className={`bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg p-1.5">
            <Crown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Upgrade to {planLabels[requiredPlan]}
            </h4>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {feature === 'this feature' ? 'This feature' : feature} requires {planLabels[requiredPlan]} plan or higher
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-bold text-orange-800 dark:text-orange-200">
              {planPrices[requiredPlan]}
            </div>
            {requiredPlan !== 'enterprise' && (
              <div className="text-xs text-orange-600 dark:text-orange-400">/month</div>
            )}
          </div>
          <button
            onClick={() => onUpgrade(requiredPlan)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeButton;
