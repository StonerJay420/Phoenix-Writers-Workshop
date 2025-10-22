import type {
  Document,
  Scene,
  Entity,
  Snapshot,
  Setting,
  APIKey,
  Chunk,
} from '../../core/db/types';

/**
 * Portable Workshop Bundle Format
 * Version 1.0.0
 */

export interface PortableBundleManifest {
  version: string;
  format: 'workshop-bundle';
  createdAt: string;
  name: string;
  description?: string;
  author?: string;
  metadata?: Record<string, unknown>;
}

export interface PortableBundleData {
  documents: Document[];
  scenes: Scene[];
  entities: Entity[];
  snapshots: Snapshot[];
  settings: Setting[];
  apiKeys: APIKey[];
  chunks: Chunk[];
}

export interface PortableBundle {
  manifest: PortableBundleManifest;
  data: PortableBundleData;
  assets?: Record<string, string>; // filename -> base64 data
  indices?: Record<string, unknown>; // custom indices
}

export interface ExportOptions {
  name: string;
  description?: string;
  author?: string;
  includeApiKeys?: boolean;
  includeSnapshots?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ImportResult {
  success: boolean;
  message: string;
  counts?: {
    documents: number;
    scenes: number;
    entities: number;
    snapshots: number;
    settings: number;
    apiKeys: number;
    chunks: number;
  };
  errors?: string[];
}

export interface ExportResult {
  success: boolean;
  message: string;
  blob?: Blob;
  filename?: string;
}
