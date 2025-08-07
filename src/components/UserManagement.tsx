import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserManagementProps {
  users: User[];
  plan: string;
  onCreateUser: (user: User) => void;
}

const roles = ['Admin', 'User', 'Manager'];

const UserManagement: React.FC<UserManagementProps> = ({ users, plan, onCreateUser }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'User' });
  const [error, setError] = useState('');

  if (plan === 'free') {
    return (
      <div className="p-8 text-center text-gray-500">
        User management is available for subscribed users only.
      </div>
    );
  }

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
    onCreateUser({
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
    });
    setForm({ name: '', email: '', role: 'User' });
    setShowCreate(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setShowCreate(true)}
          disabled={plan === 'free'}
        >
          Create New User
        </button>
      </div>
      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              value={form.name}
              onChange={handleInput}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              value={form.email}
              onChange={handleInput}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
              value={form.role}
              onChange={handleInput}
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Save
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;