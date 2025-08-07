import React, { useState, useEffect } from 'react';
import { X, Save, Box } from 'lucide-react';
import { Inventory } from '../utils/types';

interface InventoryEntryProps {
  inventory?: Inventory;
  isOpen: boolean;
  onClose: () => void;
  onSave: (inventoryData: Omit<Inventory, 'id'>) => void;
}

const defaultInventory: Omit<Inventory, 'id'> = {
  name: '',
  sku: '',
  quantity: 0,
  price: 0,
  category: '',
  description: '',
};

const InventoryEntry: React.FC<InventoryEntryProps> = ({
  inventory,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<Omit<Inventory, 'id'>>(defaultInventory);

  useEffect(() => {
    if (inventory) {
      setForm({
        name: inventory.name,
        sku: inventory.sku,
        quantity: inventory.quantity,
        price: inventory.price,
        category: inventory.category,
        description: inventory.description,
      });
    } else {
      setForm(defaultInventory);
    }
  }, [inventory, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-lg">{inventory ? 'Edit Inventory' : 'New Inventory'}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input type="text" name="sku" value={form.sku} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryEntry;