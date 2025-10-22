import React, { useState } from 'react';

interface AppShellProps {
  children?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-800 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-8">Phoenix Workshop</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <a
                  href="#dashboard"
                  className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#settings"
                  className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Welcome to Phoenix Workshop</h2>
            <div className="w-10" /> {/* Spacer for layout balance */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children || (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Getting Started
                </h3>
                <p className="text-gray-600 mb-4">
                  Welcome to Phoenix Workshop! This is a modern React application built with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>React 18 with TypeScript (strict mode)</li>
                  <li>Vite for blazing fast development</li>
                  <li>Tailwind CSS for styling</li>
                  <li>ESLint with Airbnb config + Prettier</li>
                  <li>Vitest + React Testing Library</li>
                  <li>Storybook for component documentation</li>
                  <li>PWA support with service worker</li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-700">
                    Start building your application by modifying the components in the{' '}
                    <code className="bg-blue-100 px-2 py-1 rounded">src/components</code>{' '}
                    directory.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
