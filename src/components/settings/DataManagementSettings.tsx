import React, { useState } from 'react';
import { Upload, Download, Database, Shield } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  fields: Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
  }>;
}

interface DataManagementSettingsProps {
  entities: Entity[];
  plan: string;
  onUpgrade?: (requiredPlan: string) => void;
}

const DataManagementSettings: React.FC<DataManagementSettingsProps> = ({ entities, plan, onUpgrade }) => {
  const [selectedEntity, setSelectedEntity] = useState('leads');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const isFreeTrialUser = plan === 'free';

  // Handler for file upload in data management
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  // Handler for import data
  const handleImportData = async () => {
    if (!csvFile) return;
    
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      setImportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsImporting(false);
    setCsvFile(null);
    alert('Data imported successfully!');
  };

  // Handler for export data
  const handleExportData = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return;
    
    // Create CSV headers
    const headers = entity.fields.map(field => field.name).join(',');
    const csvContent = `${headers}\n`;
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entity.name.toLowerCase()}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Plan Restriction Notice for Free Trial */}
      {isFreeTrialUser && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                Data Import/Export Not Available
              </h3>
              <p className="text-orange-700 dark:text-orange-400">
                Data Import/Export features are available starting from the Starter plan. Upgrade to manage your data efficiently.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => onUpgrade?.('starter')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Import Data */}
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${isFreeTrialUser ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Data</h3>
            {isFreeTrialUser && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Starter+
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Import data from external systems using CSV files. Field mapping will be available during import.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Entity Type
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                disabled={isFreeTrialUser}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isFreeTrialUser}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
              />
            </div>

            {csvFile && (
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  File selected: {csvFile.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Field mapping will be available in the next step
                </p>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Importing data...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleImportData}
              disabled={!csvFile || isImporting || isFreeTrialUser}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                csvFile && !isImporting && !isFreeTrialUser
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`}
            >
              {isFreeTrialUser ? 'Upgrade Required' : isImporting ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>

        {/* Export Data */}
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${isFreeTrialUser ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center space-x-2 mb-4">
            <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
            {isFreeTrialUser && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Starter+
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Export your CRM data to CSV format for backup or migration purposes.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Entity to Export
              </label>
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                disabled={isFreeTrialUser}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              >
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => handleExportData(selectedEntity)}
              disabled={isFreeTrialUser}
              className={`w-full flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors border ${
                isFreeTrialUser 
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 border-green-200 dark:border-green-500/20'
              }`}
            >
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className={`font-medium ${isFreeTrialUser ? 'text-gray-500' : 'text-green-900 dark:text-green-300'}`}>
                  {isFreeTrialUser ? 'Export Disabled' : `Export ${entities.find(e => e.id === selectedEntity)?.name}`}
                </p>
                <p className={`text-sm ${isFreeTrialUser ? 'text-gray-400' : 'text-green-700 dark:text-green-400'}`}>
                  {isFreeTrialUser ? 'Upgrade to access' : `${entities.find(e => e.id === selectedEntity)?.fields.length} fields`}
                </p>
              </div>
              <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementSettings;
