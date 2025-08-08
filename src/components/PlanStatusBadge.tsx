import React from 'react';
import { Crown, Shield, Star, Zap } from 'lucide-react';

interface PlanStatusBadgeProps {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  className?: string;
}

const PlanStatusBadge: React.FC<PlanStatusBadgeProps> = ({ plan, className = '' }) => {
  const planConfig = {
    free: {
      label: 'Free Trial',
      icon: Shield,
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-300 dark:border-gray-600'
    },
    starter: {
      label: 'Starter',
      icon: Star,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-300 dark:border-blue-600'
    },
    professional: {
      label: 'Professional',
      icon: Zap,
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      borderColor: 'border-orange-300 dark:border-orange-600'
    },
    enterprise: {
      label: 'Enterprise',
      icon: Crown,
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      borderColor: 'border-purple-300 dark:border-purple-600'
    }
  };

  const config = planConfig[plan];
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}>
      <IconComponent className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};

export default PlanStatusBadge;
