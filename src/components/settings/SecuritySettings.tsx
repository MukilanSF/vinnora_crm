import React from 'react';

const SecuritySettings: React.FC = () => {
  return (
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
};

export default SecuritySettings;
