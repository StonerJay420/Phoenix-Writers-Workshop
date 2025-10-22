import JSZip from 'jszip';
import { db, dbUtils } from '../../core/db';
import type {
  PortableBundle,
  PortableBundleManifest,
  PortableBundleData,
  ExportOptions,
  ImportResult,
  ExportResult,
} from './types';

/**
 * Portable Workshop Bundle Service
 * Export and import .workshop files containing project data
 */

const BUNDLE_VERSION = '1.0.0';
const BUNDLE_FORMAT = 'workshop-bundle';

/**
 * Export current database to a .workshop ZIP file
 */
export async function exportWorkshopBundle(
  options: ExportOptions
): Promise<ExportResult> {
  try {
    // Get all data from database
    const allData = await dbUtils.exportData();

    // Filter data based on options
    const data: PortableBundleData = {
      documents: allData.documents,
      scenes: allData.scenes,
      entities: allData.entities,
      snapshots: options.includeSnapshots ? allData.snapshots : [],
      settings: allData.settings,
      apiKeys: options.includeApiKeys ? allData.apiKeys : [],
      chunks: allData.chunks,
    };

    // Create manifest
    const manifest: PortableBundleManifest = {
      version: BUNDLE_VERSION,
      format: BUNDLE_FORMAT,
      createdAt: new Date().toISOString(),
      name: options.name,
      description: options.description,
      author: options.author,
      metadata: options.metadata,
    };

    // Create bundle
    const bundle: PortableBundle = {
      manifest,
      data,
      assets: {},
      indices: {},
    };

    // Create ZIP file
    const zip = new JSZip();

    // Add manifest
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // Add data tables
    zip.file('data/documents.json', JSON.stringify(data.documents, null, 2));
    zip.file('data/scenes.json', JSON.stringify(data.scenes, null, 2));
    zip.file('data/entities.json', JSON.stringify(data.entities, null, 2));
    zip.file('data/snapshots.json', JSON.stringify(data.snapshots, null, 2));
    zip.file('data/settings.json', JSON.stringify(data.settings, null, 2));
    zip.file('data/apiKeys.json', JSON.stringify(data.apiKeys, null, 2));
    zip.file('data/chunks.json', JSON.stringify(data.chunks, null, 2));

    // Add README
    const readme = `# ${options.name}

${options.description || 'Phoenix Workshop Bundle'}

## Bundle Information
- Format Version: ${BUNDLE_VERSION}
- Created: ${new Date().toLocaleString()}
${options.author ? `- Author: ${options.author}` : ''}

## Contents
- Documents: ${data.documents.length}
- Scenes: ${data.scenes.length}
- Entities: ${data.entities.length}
- Snapshots: ${data.snapshots.length}
- Settings: ${data.settings.length}
- API Keys: ${data.apiKeys.length}
- Chunks: ${data.chunks.length}

## Import
Open this bundle in Phoenix Workshop using the "Import Bundle" feature.

---
Generated with Phoenix Workshop
`;

    zip.file('README.md', readme);

    // Generate ZIP blob
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    const filename = `${sanitizeFilename(options.name)}.workshop`;

    return {
      success: true,
      message: 'Bundle exported successfully',
      blob,
      filename,
    };
  } catch (error) {
    return {
      success: false,
      message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Import a .workshop ZIP file into the database
 */
export async function importWorkshopBundle(
  file: File,
  options?: {
    clearExisting?: boolean;
    skipApiKeys?: boolean;
  }
): Promise<ImportResult> {
  try {
    // Read ZIP file
    const zip = await JSZip.loadAsync(file);

    // Read manifest
    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) {
      return {
        success: false,
        message: 'Invalid bundle: manifest.json not found',
      };
    }

    const manifestText = await manifestFile.async('text');
    const manifest: PortableBundleManifest = JSON.parse(manifestText);

    // Validate bundle format
    if (manifest.format !== BUNDLE_FORMAT) {
      return {
        success: false,
        message: `Invalid bundle format: expected ${BUNDLE_FORMAT}, got ${manifest.format}`,
      };
    }

    // Read data files
    const data: PortableBundleData = {
      documents: await readJsonFile(zip, 'data/documents.json'),
      scenes: await readJsonFile(zip, 'data/scenes.json'),
      entities: await readJsonFile(zip, 'data/entities.json'),
      snapshots: await readJsonFile(zip, 'data/snapshots.json'),
      settings: await readJsonFile(zip, 'data/settings.json'),
      apiKeys: await readJsonFile(zip, 'data/apiKeys.json'),
      chunks: await readJsonFile(zip, 'data/chunks.json'),
    };

    // Clear existing data if requested
    if (options?.clearExisting) {
      await dbUtils.clearAll();
    }

    // Import data
    const counts = {
      documents: 0,
      scenes: 0,
      entities: 0,
      snapshots: 0,
      settings: 0,
      apiKeys: 0,
      chunks: 0,
    };

    // Import documents (need to map IDs)
    const documentIdMap = new Map<number, number>();
    for (const doc of data.documents) {
      const oldId = doc.id;
      // eslint-disable-next-line no-param-reassign
      delete doc.id; // Let Dexie assign new ID
      const newId = await db.documents.add(doc);
      if (oldId) {
        documentIdMap.set(oldId, newId);
      }
      counts.documents += 1;
    }

    // Import scenes (update documentId references)
    for (const scene of data.scenes) {
      const oldDocId = scene.documentId;
      const newDocId = documentIdMap.get(oldDocId);
      if (newDocId) {
        // eslint-disable-next-line no-param-reassign
        scene.documentId = newDocId;
        // eslint-disable-next-line no-param-reassign
        delete scene.id;
        await db.scenes.add(scene);
        counts.scenes += 1;
      }
    }

    // Import entities
    for (const entity of data.entities) {
      // eslint-disable-next-line no-param-reassign
      delete entity.id;
      await db.entities.add(entity);
      counts.entities += 1;
    }

    // Import snapshots (update documentId references)
    for (const snapshot of data.snapshots) {
      const oldDocId = snapshot.documentId;
      const newDocId = documentIdMap.get(oldDocId);
      if (newDocId) {
        // eslint-disable-next-line no-param-reassign
        snapshot.documentId = newDocId;
        // eslint-disable-next-line no-param-reassign
        delete snapshot.id;
        await db.snapshots.add(snapshot);
        counts.snapshots += 1;
      }
    }

    // Import settings (skip if key already exists)
    for (const setting of data.settings) {
      const existing = await db.settings.where('key').equals(setting.key).first();
      if (!existing) {
        // eslint-disable-next-line no-param-reassign
        delete setting.id;
        await db.settings.add(setting);
        counts.settings += 1;
      }
    }

    // Import API keys (if not skipped)
    if (!options?.skipApiKeys) {
      for (const apiKey of data.apiKeys) {
        // eslint-disable-next-line no-param-reassign
        delete apiKey.id;
        await db.apiKeys.add(apiKey);
        counts.apiKeys += 1;
      }
    }

    // Import chunks (update documentId references)
    for (const chunk of data.chunks) {
      const oldDocId = chunk.documentId;
      const newDocId = documentIdMap.get(oldDocId);
      if (newDocId) {
        // eslint-disable-next-line no-param-reassign
        chunk.documentId = newDocId;
        // eslint-disable-next-line no-param-reassign
        delete chunk.id;
        await db.chunks.add(chunk);
        counts.chunks += 1;
      }
    }

    return {
      success: true,
      message: `Successfully imported bundle: ${manifest.name}`,
      counts,
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create a demo project bundle
 */
export async function createDemoBundle(): Promise<ExportResult> {
  return exportWorkshopBundle({
    name: 'Phoenix Workshop Demo',
    description: 'Sample project demonstrating Phoenix Workshop features',
    author: 'Phoenix Workshop Team',
    includeApiKeys: false,
    includeSnapshots: true,
    metadata: {
      demo: true,
      version: '1.0.0',
    },
  });
}

// Helper functions

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

async function readJsonFile<T>(zip: JSZip, path: string): Promise<T[]> {
  try {
    const file = zip.file(path);
    if (!file) {
      return [];
    }
    const text = await file.async('text');
    return JSON.parse(text) as T[];
  } catch (error) {
    console.warn(`Failed to read ${path}:`, error);
    return [];
  }
}
