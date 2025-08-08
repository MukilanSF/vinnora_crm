import React from 'react';
import { Upload, Save, Shield } from 'lucide-react';

interface BrandingData {
  name: string;
  tagline: string;
  logo: File | null;
}

interface BrandingSettingsProps {
  branding: BrandingData;
  setBranding: (branding: BrandingData | ((prev: BrandingData) => BrandingData)) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  setPreviewBranding: (branding: any) => void;
  plan: string;
}

const BrandingSettings: React.FC<BrandingSettingsProps> = ({
  branding,
  setBranding,
  themeColor,
  setThemeColor,
  setPreviewBranding,
  plan
}) => {
  const isProfessionalUser = plan === 'professional' || plan === 'enterprise';

  // Handler for logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBranding(prev => ({ ...prev, logo: e.target.files![0] }));
    }
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
                Personal Branding Not Available
              </h3>
              <p className="text-orange-700 dark:text-orange-400">
                Personal branding and theme customization are available starting from the Professional plan.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div className={!isProfessionalUser ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Logo
            {!isProfessionalUser && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Professional+
              </span>
            )}
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {branding.logo ? (
                    <img
                      src={URL.createObjectURL(branding.logo)}
                      alt="Brand Logo"
                      className="h-16 w-16 object-contain rounded mb-2"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> your logo
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or SVG (MAX. 2MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={!isProfessionalUser}
                  className="hidden"
                />
              </label>
            </div>
            {branding.logo && (
              <button
                onClick={() => setBranding(prev => ({ ...prev, logo: null }))}
                disabled={!isProfessionalUser}
                className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-50"
              >
                Remove Logo
              </button>
            )}
          </div>
        </div>
        
        {/* Brand Name */}
        <div className={!isProfessionalUser ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brand Name
            {!isProfessionalUser && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Professional+
              </span>
            )}
          </label>
          <input
            type="text"
            value={branding.name}
            onChange={e => setBranding(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your Company Name"
            disabled={!isProfessionalUser}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        
        {/* Tagline */}
        <div className={!isProfessionalUser ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tagline
            {!isProfessionalUser && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Professional+
              </span>
            )}
          </label>
          <input
            type="text"
            value={branding.tagline}
            onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
            placeholder="Your Brand Tagline"
            disabled={!isProfessionalUser}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        
        {/* Theme Color */}
        <div className={!isProfessionalUser ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Color
            {!isProfessionalUser && (
              <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                Professional+
              </span>
            )}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={themeColor}
              onChange={e => setThemeColor(e.target.value)}
              disabled={!isProfessionalUser}
              className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50"
            />
            <input
              type="text"
              value={themeColor}
              onChange={e => setThemeColor(e.target.value)}
              placeholder="#2563eb"
              disabled={!isProfessionalUser}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      
      {/* Apply Button */}
      <div className="flex justify-end mt-6">
        <button
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
            isProfessionalUser
              ? 'bg-orange-600 hover:bg-orange-700 text-white hover:scale-105 hover:shadow-lg hover:shadow-orange-600/25'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`}
          disabled={!isProfessionalUser}
          onClick={() => {
            if (isProfessionalUser) {
              document.documentElement.style.setProperty('--theme-color', themeColor);
              setPreviewBranding(null);
              alert('Branding changes applied successfully!');
            }
          }}
        >
          <Save className="w-4 h-4" />
          <span>{isProfessionalUser ? 'Apply Changes' : 'Upgrade Required'}</span>
        </button>
      </div>
    </div>
  );
};

export default BrandingSettings;
