import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, User } from 'lucide-react';
import { SupportTicket, Customer, Deal } from '../utils/types';

interface SupportTicketEntryProps {
  ticket?: SupportTicket;
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  customers?: Customer[];
  deals?: Deal[];
}

const defaultTicket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  contactId: '',
  dealId: '',
  status: 'open', // must match the union type: "open" | "in-progress" | "resolved" | "closed"
  priority: 'medium', // ensure this matches the union type in SupportTicket
  notes: [],
  createdBy: '',
  category: 'general',
};

const SupportTicketEntry: React.FC<SupportTicketEntryProps> = ({
  ticket,
  isOpen,
  onClose,
  onSave,
  customers = [],
  deals = [],
}) => {
  const [form, setForm] = useState<Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>>(
    defaultTicket
  );

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title,
        description: ticket.description,
        contactId: ticket.contactId || '',
        // dealId: ticket.dealId || '', // Removed because dealId does not exist on SupportTicket
        status: ticket.status,
        priority: ticket.priority,
      });
    } else {
      setForm(defaultTicket);
    }
  }, [ticket, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await Promise.resolve(onSave(form));
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {ticket ? 'Edit Support Ticket' : 'New Support Ticket'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed description of the issue, steps to reproduce, expected behavior, etc."
              rows={6}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Contact and Related Deal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact
              </label>
              <select
                name="contactId"
                value={form.contactId}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Contact</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Related Deal
              </label>
              <select
                name="dealId"
                value={form.dealId}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">None</option>
                {deals.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {ticket && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Ticket Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Ticket ID:</span>
                  <p className="font-mono text-gray-900 dark:text-white">{ticket.id}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Created By:</span>
                  <p className="text-gray-900 dark:text-white">{ticket.createdBy}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <p className="text-gray-900 dark:text-white">
                    {new Intl.DateTimeFormat('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    }).format(ticket.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Notes:</span>
                  <p className="text-gray-900 dark:text-white">{ticket.notes.length} attached</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
              !form.title.trim() || !form.description.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-orange-600/25'
            }`}
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            <span>{isSaving ? 'Saving...' : (ticket ? 'Update Ticket' : 'Create Ticket')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketEntry;