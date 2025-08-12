import React from 'react';
import { mockUsers } from '../../utils/data';

interface ProfileData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  plan: string;
}

interface ProfileSettingsProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  onUserUpdate?: (userData: { name: string; email: string; plan: string }) => void;
  onUpgrade?: (requiredPlan: string) => void;
}

// Available plans for testing
const availablePlans = [
  { value: 'free', label: 'Free Trial', price: '₹0', features: 'Basic features only' },
  { value: 'starter', label: 'Starter Plan', price: '₹2,999', features: 'Email functionality, Basic reports' },
  { value: 'professional', label: 'Professional Plan', price: '₹6,999', features: 'All features, Advanced analytics' },
  { value: 'enterprise', label: 'Enterprise Plan', price: '₹14,999', features: 'Custom integrations, Priority support' }
];

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profileData, setProfileData, onUserUpdate, onUpgrade }) => {
  const handleUserSwitch = (userId: string) => {
    const selectedUser = mockUsers.find(user => user.id === userId);
    if (selectedUser) {
      const newProfileData = {
        ...profileData,
        fullName: selectedUser.name,
        email: selectedUser.email,
        company: selectedUser.role === 'admin' ? 'Vinnora CRM (Admin)' : `Vinnora CRM (${selectedUser.role})`
      };
      setProfileData(newProfileData);
      
      // Update the current user in the parent component
      if (onUserUpdate) {
        onUserUpdate({
          name: selectedUser.name,
          email: selectedUser.email,
          plan: newProfileData.plan
        });
      }
    }
  };

  const handlePlanChange = (newPlan: string) => {
    const newProfileData = { ...profileData, plan: newPlan };
    setProfileData(newProfileData);
    
    // Update the current user in the parent component
    if (onUserUpdate) {
      onUserUpdate({
        name: newProfileData.fullName,
        email: newProfileData.email,
        plan: newPlan
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Testing Controls Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Testing Controls (Development Mode)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Switcher */}
          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Switch User (for testing)
            </label>
            <select
              onChange={(e) => handleUserSwitch(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a user to test...</option>
              {mockUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Plan Switcher */}
          <div>
            <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              Current Plan (for testing)
            </label>
            <select
              value={profileData.plan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availablePlans.map(plan => (
                <option key={plan.value} value={plan.value}>
                  {plan.label} - {plan.price}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Plan Info */}
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                {availablePlans.find(p => p.value === profileData.plan)?.label || 'Unknown Plan'}
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {availablePlans.find(p => p.value === profileData.plan)?.features}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                {availablePlans.find(p => p.value === profileData.plan)?.price}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">per month</div>
            </div>
          </div>
          {profileData.plan === 'free' && onUpgrade && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
              <button
                onClick={() => onUpgrade('professional')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>🚀</span>
                <span>Upgrade to Professional</span>
              </button>
              <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-2">
                Unlock all features with a paid plan
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Regular Profile Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Profile Information
        </h3>
        
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

        {/* Logout Button */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              window.location.reload(); // fallback if no prop, will trigger logout in most SPA setups
            }
          }}
          className="flex items-center space-x-2 bg-gray-200 hover:bg-red-600 hover:text-white text-gray-800 px-6 py-3 rounded-lg transition-all duration-200 mt-8 w-full justify-center border border-gray-300 hover:border-red-700"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
