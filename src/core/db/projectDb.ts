import Dexie, { Table } from 'dexie';
import type {
  Document,
  Scene,
  Entity,
  Snapshot,
  Setting,
  APIKey,
  Chunk,
} from './types';

/**
 * Phoenix Workshop Database
 * Manages all local data storage using IndexedDB via Dexie
 */
export class ProjectDatabase extends Dexie {
  // Table definitions
  documents!: Table<Document, number>;
  scenes!: Table<Scene, number>;
  entities!: Table<Entity, number>;
  snapshots!: Table<Snapshot, number>;
  settings!: Table<Setting, number>;
  apiKeys!: Table<APIKey, number>;
  chunks!: Table<Chunk, number>;

  constructor() {
    super('PhoenixWorkshopDB');

    // Version 1: Initial schema
    this.version(1).stores({
      documents: '++id, projectId, title, createdAt, updatedAt',
      scenes: '++id, documentId, order, createdAt, updatedAt',
      entities: '++id, type, name, createdAt, updatedAt',
      snapshots: '++id, documentId, timestamp',
      settings: '++id, key, category, updatedAt',
      apiKeys: '++id, service, isActive, createdAt',
      chunks: '++id, documentId, position, createdAt',
    });

    // Version 2: Add tags to entities (example migration)
    this.version(2)
      .stores({
        entities: '++id, type, name, *tags, createdAt, updatedAt',
      })
      .upgrade((trans) => {
        // Migration logic for version 2
        return trans
          .table('entities')
          .toCollection()
          .modify((entity) => {
            if (!entity.tags) {
              // eslint-disable-next-line no-param-reassign
              entity.tags = [];
            }
          });
      });

    // Version 3: Add embedding support to chunks
    this.version(3)
      .stores({
        chunks: '++id, documentId, position, *embedding, createdAt',
      })
      .upgrade((trans) => {
        // Migration logic for version 3
        return trans
          .table('chunks')
          .toCollection()
          .modify((chunk) => {
            if (!chunk.embedding) {
              // eslint-disable-next-line no-param-reassign
              chunk.embedding = [];
            }
          });
      });
  }
}

// Create and export database instance
export const db = new ProjectDatabase();

// Utility functions for common operations
export const dbUtils = {
  /**
   * Clear all data from the database
   */
  async clearAll(): Promise<void> {
    await Promise.all([
      db.documents.clear(),
      db.scenes.clear(),
      db.entities.clear(),
      db.snapshots.clear(),
      db.settings.clear(),
      db.apiKeys.clear(),
      db.chunks.clear(),
    ]);
  },

  /**
   * Export all data from the database
   */
  async exportData(): Promise<{
    documents: Document[];
    scenes: Scene[];
    entities: Entity[];
    snapshots: Snapshot[];
    settings: Setting[];
    apiKeys: APIKey[];
    chunks: Chunk[];
  }> {
    const [documents, scenes, entities, snapshots, settings, apiKeys, chunks] =
      await Promise.all([
        db.documents.toArray(),
        db.scenes.toArray(),
        db.entities.toArray(),
        db.snapshots.toArray(),
        db.settings.toArray(),
        db.apiKeys.toArray(),
        db.chunks.toArray(),
      ]);

    return {
      documents,
      scenes,
      entities,
      snapshots,
      settings,
      apiKeys,
      chunks,
    };
  },

  /**
   * Import data into the database
   */
  async importData(data: {
    documents?: Document[];
    scenes?: Scene[];
    entities?: Entity[];
    snapshots?: Snapshot[];
    settings?: Setting[];
    apiKeys?: APIKey[];
    chunks?: Chunk[];
  }): Promise<void> {
    if (data.documents) await db.documents.bulkAdd(data.documents);
    if (data.scenes) await db.scenes.bulkAdd(data.scenes);
    if (data.entities) await db.entities.bulkAdd(data.entities);
    if (data.snapshots) await db.snapshots.bulkAdd(data.snapshots);
    if (data.settings) await db.settings.bulkAdd(data.settings);
    if (data.apiKeys) await db.apiKeys.bulkAdd(data.apiKeys);
    if (data.chunks) await db.chunks.bulkAdd(data.chunks);
  },

  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    documents: number;
    scenes: number;
    entities: number;
    snapshots: number;
    settings: number;
    apiKeys: number;
    chunks: number;
  }> {
    const [documents, scenes, entities, snapshots, settings, apiKeys, chunks] =
      await Promise.all([
        db.documents.count(),
        db.scenes.count(),
        db.entities.count(),
        db.snapshots.count(),
        db.settings.count(),
        db.apiKeys.count(),
        db.chunks.count(),
      ]);

    return {
      documents,
      scenes,
      entities,
      snapshots,
      settings,
      apiKeys,
      chunks,
    };
  },
};
