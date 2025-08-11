import React, { useState } from 'react';
import { Users, UserPlus, Mail, Shield, Crown } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

interface UserManagementSettingsProps {
  users: User[];
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  onCreateUser: (user: User) => void;
  onUpgrade?: (requiredPlan: string) => void;
}

const roles = [
  { value: 'admin', label: 'Admin', icon: Crown, description: 'Full system access' },
  { value: 'sales-rep', label: 'Sales Rep', icon: Users, description: 'Sales and customer management' },
  { value: 'manager', label: 'Manager', icon: Shield, description: 'Team management access' }
];

const UserManagementSettings: React.FC<UserManagementSettingsProps> = ({ users, plan, onCreateUser, onUpgrade }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'sales-rep' });
  const [error, setError] = useState('');

  // Plan restrictions for user management
  const canCreateUsers = plan !== 'free';
  const maxUsers = {
    free: 1,
    starter: 3,
    professional: 10,
    enterprise: Infinity
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.role) {
      setError('All fields are required.');
      return;
    }

    if (users.length >= maxUsers[plan]) {
      setError(`Your ${plan} plan supports up to ${maxUsers[plan]} users. Upgrade to add more users.`);
      return;
    }

    onCreateUser({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
      active: true
    });
    setForm({ name: '', email: '', role: 'sales-rep' });
    setShowCreate(false);
  };

  if (plan === 'free') {
    return (
      <div className="space-y-6">
        {/* Free Plan Upgrade Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-2">
                User Management Not Available
              </h3>
              <p className="text-orange-700 dark:text-orange-400 mb-4">
                User management features are available starting from the Starter plan. Upgrade to manage team members, assign roles, and collaborate effectively.
              </p>
              
              {/* Plan Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Starter Plan</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Up to 3 users</div>
                  <div className="text-lg font-bold text-orange-600">₹2,999/mo</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Professional</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Up to 10 users</div>
                  <div className="text-lg font-bold text-orange-600">₹6,999/mo</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Enterprise</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Unlimited users</div>
                  <div className="text-lg font-bold text-orange-600">Custom</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={() => onUpgrade?.('starter')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Starter</span>
                </button>
                <button 
                  onClick={() => onUpgrade?.('professional')}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade to Professional</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 opacity-60 pointer-events-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600 bg-blue-100 rounded-lg p-2" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  User Management Preview
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Available with Starter plan and above
                </p>
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-full">
              <span className="text-orange-700 dark:text-orange-300 text-xs font-medium">Upgrade Required</span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Admin User</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">admin@company.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded">
                  Admin
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  S
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Sales Rep</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">sales@company.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded">
                  Sales Rep
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-600 bg-blue-100 rounded-lg p-2" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              User Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage team members and their roles
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              canCreateUsers && users.length < maxUsers[plan]
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => setShowCreate(true)}
            disabled={!canCreateUsers || users.length >= maxUsers[plan]}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
          {(!canCreateUsers || users.length >= maxUsers[plan]) && onUpgrade && (
            <button
              onClick={() => onUpgrade('professional')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Professional</span>
            </button>
          )}
        </div>
      </div>

      {/* Plan limits info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </span>
          </div>
          <div className="text-blue-600 dark:text-blue-400 text-sm">
            {users.length} / {maxUsers[plan] === Infinity ? '∞' : maxUsers[plan]} users
          </div>
        </div>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Add New User
          </h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.email}
                  onChange={handleInput}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                name="role"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.role}
                onChange={handleInput}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                onClick={() => {
                  setShowCreate(false);
                  setError('');
                  setForm({ name: '', email: '', role: 'sales-rep' });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Team Members
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => {
                const userRole = roles.find(r => r.value === user.role) || roles[1];
                const IconComponent = userRole.icon;
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <IconComponent className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {userRole.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No team members yet</p>
                    <p className="text-sm">Add your first team member to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementSettings;
