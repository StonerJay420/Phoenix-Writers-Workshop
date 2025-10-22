import { db } from './projectDb';
import type { Document, Scene, Entity, Setting } from './types';

/**
 * Migration utilities for database schema changes
 */

export interface MigrationResult {
  success: boolean;
  version: number;
  message: string;
  recordsAffected?: number;
}

/**
 * Migration history and metadata
 */
export const migrationHistory = {
  v1: {
    version: 1,
    description: 'Initial schema with all core tables',
    appliedAt: '2024-01-01',
  },
  v2: {
    version: 2,
    description: 'Added tags support to entities table',
    appliedAt: '2024-01-15',
  },
  v3: {
    version: 3,
    description: 'Added embedding support to chunks table',
    appliedAt: '2024-02-01',
  },
};

/**
 * Manually run migrations if needed
 */
export const migrations = {
  /**
   * Migrate entities to add tags field
   */
  async migrateEntitiesToV2(): Promise<MigrationResult> {
    try {
      let count = 0;
      await db.entities.toCollection().modify((entity) => {
        if (!entity.tags) {
          // eslint-disable-next-line no-param-reassign
          entity.tags = [];
          count += 1;
        }
      });

      return {
        success: true,
        version: 2,
        message: 'Successfully migrated entities to version 2',
        recordsAffected: count,
      };
    } catch (error) {
      return {
        success: false,
        version: 2,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  /**
   * Migrate chunks to add embedding field
   */
  async migrateChunksToV3(): Promise<MigrationResult> {
    try {
      let count = 0;
      await db.chunks.toCollection().modify((chunk) => {
        if (!chunk.embedding) {
          // eslint-disable-next-line no-param-reassign
          chunk.embedding = [];
          count += 1;
        }
      });

      return {
        success: true,
        version: 3,
        message: 'Successfully migrated chunks to version 3',
        recordsAffected: count,
      };
    } catch (error) {
      return {
        success: false,
        version: 3,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },

  /**
   * Run all pending migrations
   */
  async runAllMigrations(): Promise<MigrationResult[]> {
    const results: MigrationResult[] = [];

    // Check and run v2 migration
    const v2Result = await this.migrateEntitiesToV2();
    results.push(v2Result);

    // Check and run v3 migration
    const v3Result = await this.migrateChunksToV3();
    results.push(v3Result);

    return results;
  },

  /**
   * Verify database integrity
   */
  async verifyIntegrity(): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // Check if all tables exist
      const tables = ['documents', 'scenes', 'entities', 'snapshots', 'settings', 'apiKeys', 'chunks'];
      for (const tableName of tables) {
        try {
          await db.table(tableName).limit(1).toArray();
        } catch (error) {
          issues.push(`Table '${tableName}' is not accessible`);
        }
      }

      // Check for orphaned scenes (scenes without valid documents)
      const scenes = await db.scenes.toArray();
      const documentIds = new Set((await db.documents.toArray()).map((d) => d.id));
      const orphanedScenes = scenes.filter((s) => !documentIds.has(s.documentId));
      if (orphanedScenes.length > 0) {
        issues.push(`Found ${orphanedScenes.length} orphaned scenes`);
      }

      // Check for orphaned chunks (chunks without valid documents)
      const chunks = await db.chunks.toArray();
      const orphanedChunks = chunks.filter((c) => !documentIds.has(c.documentId));
      if (orphanedChunks.length > 0) {
        issues.push(`Found ${orphanedChunks.length} orphaned chunks`);
      }

      // Check for orphaned snapshots
      const snapshots = await db.snapshots.toArray();
      const orphanedSnapshots = snapshots.filter((s) => !documentIds.has(s.documentId));
      if (orphanedSnapshots.length > 0) {
        issues.push(`Found ${orphanedSnapshots.length} orphaned snapshots`);
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    } catch (error) {
      issues.push(`Integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        valid: false,
        issues,
      };
    }
  },

  /**
   * Clean up orphaned records
   */
  async cleanupOrphans(): Promise<{
    cleaned: number;
    details: string[];
  }> {
    let cleaned = 0;
    const details: string[] = [];

    try {
      // Get all valid document IDs
      const documentIds = new Set((await db.documents.toArray()).map((d) => d.id));

      // Remove orphaned scenes
      const orphanedScenes = await db.scenes
        .filter((s) => !documentIds.has(s.documentId))
        .toArray();
      if (orphanedScenes.length > 0) {
        await db.scenes.bulkDelete(orphanedScenes.map((s) => s.id!));
        cleaned += orphanedScenes.length;
        details.push(`Removed ${orphanedScenes.length} orphaned scenes`);
      }

      // Remove orphaned chunks
      const orphanedChunks = await db.chunks
        .filter((c) => !documentIds.has(c.documentId))
        .toArray();
      if (orphanedChunks.length > 0) {
        await db.chunks.bulkDelete(orphanedChunks.map((c) => c.id!));
        cleaned += orphanedChunks.length;
        details.push(`Removed ${orphanedChunks.length} orphaned chunks`);
      }

      // Remove orphaned snapshots
      const orphanedSnapshots = await db.snapshots
        .filter((s) => !documentIds.has(s.documentId))
        .toArray();
      if (orphanedSnapshots.length > 0) {
        await db.snapshots.bulkDelete(orphanedSnapshots.map((s) => s.id!));
        cleaned += orphanedSnapshots.length;
        details.push(`Removed ${orphanedSnapshots.length} orphaned snapshots`);
      }

      return { cleaned, details };
    } catch (error) {
      details.push(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { cleaned, details };
    }
  },
};

/**
 * Get current database version
 */
export async function getCurrentVersion(): Promise<number> {
  return db.verno;
}

/**
 * Check if database needs migration
 */
export async function needsMigration(): Promise<boolean> {
  const currentVersion = await getCurrentVersion();
  const latestVersion = Math.max(...Object.values(migrationHistory).map((m) => m.version));
  return currentVersion < latestVersion;
}
