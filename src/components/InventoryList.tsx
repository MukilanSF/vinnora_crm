import React from 'react';
import { Inventory } from '../utils/types';

interface InventoryListProps {
  inventories: Inventory[];
  onAddInventory: () => void;
  onEditInventory: (inventory: Inventory) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ inventories, onAddInventory, onEditInventory }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your product inventory</p>
      </div>
      <button
        onClick={onAddInventory}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
      >
        + New Inventory
      </button>
    </div>
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKU</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {inventories.map((item) => (
            <tr
              key={item.id}
              onClick={() => onEditInventory(item)}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.sku}</td>
              <td className="px-6 py-4">{item.quantity}</td>
              <td className="px-6 py-4">{item.price}</td>
              <td className="px-6 py-4">{item.category}</td>
            </tr>
          ))}
          {inventories.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No inventory found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default InventoryList;