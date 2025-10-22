import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, dbUtils, seedDatabase, resetAndReseed, isDatabaseSeeded, getCurrentVersion } from '../core/db';
import { Button } from '../ui/components/Button';
import {
  exportWorkshopBundle,
  importWorkshopBundle,
  downloadBlob,
  createDemoBundle,
} from '../modules/portable';

export const DatabaseDemo: React.FC = () => {
  const [isSeeded, setIsSeeded] = useState<boolean>(false);
  const [dbVersion, setDbVersion] = useState<number>(0);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live queries for real-time updates
  const documents = useLiveQuery(() => db.documents.toArray(), []);
  const scenes = useLiveQuery(() => db.scenes.toArray(), []);
  const entities = useLiveQuery(() => db.entities.toArray(), []);
  const settings = useLiveQuery(() => db.settings.toArray(), []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const seeded = await isDatabaseSeeded();
      setIsSeeded(seeded);
      const version = await getCurrentVersion();
      setDbVersion(version);
      const dbStats = await dbUtils.getStats();
      setStats(dbStats);
    };
    loadData();
  }, [documents, scenes, entities, settings]);

  const handleSeed = async () => {
    const result = await seedDatabase();
    if (result.success) {
      const seeded = await isDatabaseSeeded();
      setIsSeeded(seeded);
      const dbStats = await dbUtils.getStats();
      setStats(dbStats);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset the database? This will delete all data.')) {
      await resetAndReseed();
      const seeded = await isDatabaseSeeded();
      setIsSeeded(seeded);
      const dbStats = await dbUtils.getStats();
      setStats(dbStats);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      await dbUtils.clearAll();
      setIsSeeded(false);
      const dbStats = await dbUtils.getStats();
      setStats(dbStats);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportWorkshopBundle({
        name: 'My Workshop Project',
        description: 'Exported from Phoenix Workshop',
        includeApiKeys: false,
        includeSnapshots: true,
      });

      if (result.success && result.blob && result.filename) {
        downloadBlob(result.blob, result.filename);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await importWorkshopBundle(file, {
        clearExisting: false,
        skipApiKeys: true,
      });

      if (result.success) {
        alert(`${result.message}\n\nImported:\n${JSON.stringify(result.counts, null, 2)}`);
        const seeded = await isDatabaseSeeded();
        setIsSeeded(seeded);
        const dbStats = await dbUtils.getStats();
        setStats(dbStats);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLoadDemo = async () => {
    if (
      window.confirm(
        'This will load the demo project into your database. Continue?'
      )
    ) {
      setIsExporting(true);
      try {
        const result = await createDemoBundle();
        if (result.success && result.blob) {
          // Convert blob to file
          const file = new File([result.blob], 'demo.workshop', {
            type: 'application/zip',
          });

          // Import the demo bundle
          setIsImporting(true);
          const importResult = await importWorkshopBundle(file, {
            clearExisting: false,
            skipApiKeys: true,
          });

          if (importResult.success) {
            alert(`Demo project loaded successfully!\n\nImported:\n${JSON.stringify(importResult.counts, null, 2)}`);
            const seeded = await isDatabaseSeeded();
            setIsSeeded(seeded);
            const dbStats = await dbUtils.getStats();
            setStats(dbStats);
          } else {
            alert(importResult.message);
          }
        }
      } catch (error) {
        alert(`Failed to load demo: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsExporting(false);
        setIsImporting(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Database Demo</h2>

        {/* Database Info */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Database Version:</span> {dbVersion}
            </div>
            <div>
              <span className="font-semibold">Seeded:</span>{' '}
              <span className={isSeeded ? 'text-green-600' : 'text-red-600'}>
                {isSeeded ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Database Actions</h3>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSeed} disabled={isSeeded} variant="primary">
              Seed Database
            </Button>
            <Button onClick={handleReset} variant="secondary">
              Reset & Reseed
            </Button>
            <Button onClick={handleClearAll} variant="danger">
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Import/Export Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Import/Export</h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleLoadDemo}
              variant="primary"
              isLoading={isExporting || isImporting}
            >
              Load Demo Project
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              isLoading={isExporting}
              disabled={stats.documents === 0}
            >
              Export .workshop Bundle
            </Button>
            <Button
              onClick={handleImportClick}
              variant="outline"
              isLoading={isImporting}
            >
              Import .workshop Bundle
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".workshop"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Database Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Documents" count={stats.documents || 0} />
            <StatCard label="Scenes" count={stats.scenes || 0} />
            <StatCard label="Entities" count={stats.entities || 0} />
            <StatCard label="Settings" count={stats.settings || 0} />
            <StatCard label="Snapshots" count={stats.snapshots || 0} />
            <StatCard label="API Keys" count={stats.apiKeys || 0} />
            <StatCard label="Chunks" count={stats.chunks || 0} />
          </div>
        </div>

        {/* Documents List */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Documents</h3>
          {documents && documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">Project: {doc.projectId}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No documents found. Seed the database to add sample data.</p>
          )}
        </div>

        {/* Scenes List */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Scenes</h3>
          {scenes && scenes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenes.map((scene) => (
                <div key={scene.id} className="p-3 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-800 text-sm">{scene.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">Order: {scene.order}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scene.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No scenes found.</p>
          )}
        </div>

        {/* Entities List */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Entities</h3>
          {entities && entities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {entities.map((entity) => (
                <div key={entity.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{entity.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {entity.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{entity.description}</p>
                  {entity.tags && entity.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entity.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No entities found.</p>
          )}
        </div>

        {/* Settings List */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Settings</h3>
          {settings && settings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Key
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {settings.map((setting) => (
                    <tr key={setting.id}>
                      <td className="px-4 py-2 text-sm text-gray-800">{setting.key}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {String(setting.value)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{setting.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No settings found.</p>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <h4 className="font-semibold text-green-900 mb-2">About This Database</h4>
          <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
            <li>Uses Dexie 3.2 for IndexedDB management</li>
            <li>Includes 7 tables: documents, scenes, entities, snapshots, settings, apiKeys, chunks</li>
            <li>Versioned schema with migration support</li>
            <li>Sample data automatically seeded on first load</li>
            <li>All data persisted locally in your browser</li>
            <li>Live queries update UI in real-time</li>
            <li>Export/Import .workshop bundles for portability (ZIP format with JSON)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Stat card component
const StatCard: React.FC<{ label: string; count: number }> = ({ label, count }) => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="text-2xl font-bold text-gray-800">{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

export default DatabaseDemo;
