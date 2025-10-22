import React, { useState } from 'react';
import AppShell from './components/AppShell';
import StoreDemo from './components/StoreDemo';
import DatabaseDemo from './components/DatabaseDemo';

type Tab = 'store' | 'database';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('database');

  return (
    <AppShell>
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'database'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            Database Demo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'store'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            Store Demo
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'database' && <DatabaseDemo />}
      {activeTab === 'store' && <StoreDemo />}
    </AppShell>
  );
};

export default App;
