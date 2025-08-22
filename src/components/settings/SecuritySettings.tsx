import React, { useState } from 'react';

const SecuritySettings: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    // Actual delete logic here
    alert('Your account has been deleted.');
  };

  return (
    <div className="relative min-h-[400px]">
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

      {/* Delete Account Button - bottom right, 25% smaller */}
      <button
        className="absolute bottom-6 right-6 px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        style={{ fontSize: '0.85rem' }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Account
      </button>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-700 mb-4">Confirm Account Deletion</h2>
            <p className="mb-6 text-gray-800 font-medium">
              <span className="font-bold text-red-700">Warning:</span> Your data will be <span className="font-bold">completely lost</span> and your account will be <span className="font-bold">permanently deleted</span>.
            </p>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                onClick={handleDeleteAccount}
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
