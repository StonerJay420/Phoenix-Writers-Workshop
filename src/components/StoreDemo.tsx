import React from 'react';
import { useAppStore } from '../core/store/appStore';
import { Button } from '../ui/components/Button';

export const StoreDemo: React.FC = () => {
  const { theme, locale, aiKillSwitch, setTheme, setLocale, toggleAiKillSwitch } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Store Persistence Demo</h2>

        <div className="space-y-6">
          {/* Theme Section */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Theme Setting</h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 min-w-[120px]">Current Theme:</span>
              <span className="font-medium text-blue-600">{theme}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant={theme === 'light' ? 'primary' : 'outline'}
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={theme === 'dark' ? 'primary' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
              <Button
                size="sm"
                variant={theme === 'system' ? 'primary' : 'outline'}
                onClick={() => setTheme('system')}
              >
                System
              </Button>
            </div>
          </div>

          {/* Locale Section */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Locale Setting</h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 min-w-[120px]">Current Locale:</span>
              <span className="font-medium text-blue-600">{locale}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={locale === 'en' ? 'primary' : 'outline'}
                onClick={() => setLocale('en')}
              >
                English
              </Button>
              <Button
                size="sm"
                variant={locale === 'es' ? 'primary' : 'outline'}
                onClick={() => setLocale('es')}
              >
                Español
              </Button>
              <Button
                size="sm"
                variant={locale === 'fr' ? 'primary' : 'outline'}
                onClick={() => setLocale('fr')}
              >
                Français
              </Button>
              <Button
                size="sm"
                variant={locale === 'de' ? 'primary' : 'outline'}
                onClick={() => setLocale('de')}
              >
                Deutsch
              </Button>
              <Button
                size="sm"
                variant={locale === 'ja' ? 'primary' : 'outline'}
                onClick={() => setLocale('ja')}
              >
                日本語
              </Button>
              <Button
                size="sm"
                variant={locale === 'zh' ? 'primary' : 'outline'}
                onClick={() => setLocale('zh')}
              >
                中文
              </Button>
            </div>
          </div>

          {/* AI Kill Switch Section */}
          <div className="pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Kill Switch</h3>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 min-w-[120px]">Status:</span>
              <span
                className={`font-medium ${aiKillSwitch ? 'text-red-600' : 'text-green-600'}`}
              >
                {aiKillSwitch ? 'Disabled' : 'Enabled'}
              </span>
            </div>
            <div className="mt-4">
              <Button
                variant={aiKillSwitch ? 'danger' : 'primary'}
                onClick={toggleAiKillSwitch}
              >
                {aiKillSwitch ? 'Enable AI Features' : 'Disable AI Features'}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Testing Persistence</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
              <li>Change the theme, locale, or AI kill switch settings above</li>
              <li>Refresh the page (F5 or Cmd/Ctrl+R)</li>
              <li>Verify that your settings are preserved</li>
              <li>Check the browser&apos;s localStorage to see the stored data</li>
            </ol>
          </div>

          {/* LocalStorage Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold text-gray-900 mb-2">LocalStorage Data</h4>
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
              {JSON.stringify(
                {
                  theme,
                  locale,
                  aiKillSwitch,
                },
                null,
                2
              )}
            </pre>
            <p className="text-xs text-gray-600 mt-2">
              Key: <code className="bg-gray-200 px-2 py-1 rounded">phoenix-workshop-storage</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDemo;
