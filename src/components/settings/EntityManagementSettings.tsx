import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Save, X } from 'lucide-react';

interface EntityField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

interface Entity {
  id: string;
  name: string;
  fields: EntityField[];
}

interface EntityManagementSettingsProps {
  entities: Entity[];
  plan: string;
}

const EntityManagementSettings: React.FC<EntityManagementSettingsProps> = ({ entities, plan }) => {
  const [localEntities, setLocalEntities] = useState(entities);
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id || '');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('String');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const isProfessionalUser = plan === 'professional' || plan === 'enterprise';

  const fieldTypes = ['String', 'Number', 'Email', 'Phone', 'Date', 'Boolean', 'Dropdown', 'Id'];
  
  const selectedEntity = localEntities.find(entity => entity.id === selectedEntityId);

  const handleAddField = () => {
    if (!newFieldName.trim() || !selectedEntity) return;

    const newField: EntityField = {
      id: `field_${Date.now()}`,
      name: newFieldName,
      type: newFieldType,
      required: newFieldRequired
    };

    setLocalEntities(prev =>
      prev.map(entity =>
        entity.id === selectedEntityId
          ? { ...entity, fields: [...entity.fields, newField] }
          : entity
      )
    );

    setNewFieldName('');
    setNewFieldType('String');
    setNewFieldRequired(false);
    setEditingEntity(null);
  };

  const handleDeleteField = (fieldId: string) => {
    setLocalEntities(prev =>
      prev.map(entity =>
        entity.id === selectedEntityId
          ? { ...entity, fields: entity.fields.filter(field => field.id !== fieldId) }
          : entity
      )
    );
  };

  const handleFieldEdit = (fieldId: string, updates: Partial<EntityField>) => {
    setLocalEntities(prev =>
      prev.map(entity =>
        entity.id === selectedEntityId
          ? {
              ...entity,
              fields: entity.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : entity
      )
    );
  };

  const handleSaveChanges = () => {
    // Here you would typically save to your backend
    console.log('Saving entity configurations:', localEntities);
    alert('Entity configurations saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Plan Restriction Notice for Non-Professional Users */}
      {!isProfessionalUser && (
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">
                Custom Entity Management Not Available
              </h3>
              <p className="text-orange-700 dark:text-orange-400">
                Custom entity creation and field management are available starting from the Professional plan.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors">
              Upgrade to Professional
            </button>
          </div>
        </div>
      )}

      {/* Entity Selection Dropdown */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Entity to Manage</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose an entity to configure its fields and properties
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Entity Type
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              disabled={!isProfessionalUser}
              className={`w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isProfessionalUser ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {localEntities.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedEntity && (
            <div className="flex items-end">
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4 w-full">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">{selectedEntity.fields.length} fields</span> configured for {selectedEntity.name}
                  {!isProfessionalUser && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                      Professional+
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Entity Fields Management */}
      {selectedEntity && (
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 ${
          !isProfessionalUser ? 'opacity-50' : ''
        }`}>
          {/* Entity Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedEntity.name} Fields
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage fields for the {selectedEntity.name} entity
              </p>
            </div>
            <button
              onClick={() => setEditingEntity(editingEntity === selectedEntity.id ? null : selectedEntity.id)}
              disabled={!isProfessionalUser}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isProfessionalUser
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>

          {/* Add New Field Form */}
          {editingEntity === selectedEntity.id && isProfessionalUser && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-4">Add New Field</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g., Customer Name"
                    className="w-full bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Field Type
                  </label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`required-${selectedEntity.id}`}
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`required-${selectedEntity.id}`} className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Required
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddField}
                    disabled={!newFieldName.trim()}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={() => setEditingEntity(null)}
                    className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fields Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Field Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Required</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedEntity.fields.map((field) => (
                  <tr key={field.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">
                      {editingField === field.id ? (
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleFieldEdit(field.id, { name: e.target.value })
                          }
                          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white"
                        />
                      ) : (
                        <span className="text-gray-900 dark:text-white">{field.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingField === field.id ? (
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleFieldEdit(field.id, { type: e.target.value })
                          }
                          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          field.type === 'Dropdown' 
                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {field.type}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingField === field.id ? (
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            handleFieldEdit(field.id, { required: e.target.checked })
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            field.required
                              ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                              : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                          }`}
                        >
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {editingField === field.id ? (
                          <>
                            <button
                              onClick={() => setEditingField(null)}
                              className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                              disabled={!isProfessionalUser}
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="p-1 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                              disabled={!isProfessionalUser}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingField(field.id)}
                              className="p-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                              disabled={!isProfessionalUser}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteField(field.id)}
                              className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                              disabled={!isProfessionalUser || field.id === 'id'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Save All Changes Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveChanges}
          disabled={!isProfessionalUser}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
            isProfessionalUser
              ? 'bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-orange-600/25'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isProfessionalUser ? 'Save All Changes' : 'Upgrade Required'}</span>
        </button>
      </div>
    </div>
  );
};

export default EntityManagementSettings;
