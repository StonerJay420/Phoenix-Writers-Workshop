import { db } from './projectDb';
import type { Document, Scene, Entity, Setting, APIKey, Chunk } from './types';

/**
 * Seed sample data into the database on first load
 */

const SEED_FLAG_KEY = 'database_seeded';

/**
 * Check if database has been seeded
 */
export async function isDatabaseSeeded(): Promise<boolean> {
  const setting = await db.settings.where('key').equals(SEED_FLAG_KEY).first();
  return setting?.value === true;
}

/**
 * Mark database as seeded
 */
async function markAsSeeded(): Promise<void> {
  await db.settings.add({
    key: SEED_FLAG_KEY,
    value: true,
    category: 'general',
    description: 'Flag indicating the database has been seeded with sample data',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

/**
 * Sample documents data
 */
const sampleDocuments: Omit<Document, 'id'>[] = [
  {
    title: 'Welcome to Phoenix Workshop',
    content: `# Welcome to Phoenix Workshop

This is your first document in Phoenix Workshop. This application helps you organize and manage your creative writing projects with powerful tools and AI assistance.

## Getting Started

Phoenix Workshop provides several features to help you write:

- **Document Management**: Create and organize multiple documents
- **Scene Organization**: Break your work into manageable scenes
- **Entity Tracking**: Keep track of characters, locations, and other story elements
- **Version Control**: Save snapshots of your work at any point
- **AI Integration**: Connect to AI services for writing assistance

## Your First Steps

1. Explore this sample project
2. Create your own documents
3. Add scenes and entities
4. Start writing!

Happy writing!`,
    projectId: 'sample-project-001',
    metadata: {
      type: 'guide',
      featured: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Sample scenes data
 */
const sampleScenes: Omit<Scene, 'id' | 'documentId'>[] = [
  {
    title: 'Introduction',
    content: 'Welcome to your first scene. Scenes help you break down your document into manageable parts.',
    order: 1,
    metadata: {
      status: 'draft',
      wordCount: 15,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Getting Started',
    content: 'This is your second scene. You can rearrange scenes by changing their order.',
    order: 2,
    metadata: {
      status: 'draft',
      wordCount: 13,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Sample entities data
 */
const sampleEntities: Omit<Entity, 'id'>[] = [
  {
    type: 'character',
    name: 'Phoenix',
    description: 'The mythical bird that symbolizes rebirth and creativity, representing the core spirit of this workshop.',
    tags: ['mythical', 'mascot', 'inspiration'],
    metadata: {
      role: 'mascot',
      symbolism: 'creativity and rebirth',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: 'location',
    name: 'The Workshop',
    description: 'A creative space where ideas are born, refined, and brought to life through writing.',
    tags: ['setting', 'creative-space'],
    metadata: {
      atmosphere: 'inspiring and productive',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: 'concept',
    name: 'Creative Flow',
    description: 'The state of being fully immersed in the creative process, where ideas flow naturally.',
    tags: ['creativity', 'writing', 'productivity'],
    metadata: {
      importance: 'high',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Sample settings data
 */
const sampleSettings: Omit<Setting, 'id'>[] = [
  {
    key: 'editor_font_size',
    value: 16,
    category: 'editor',
    description: 'Default font size for the editor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    key: 'editor_theme',
    value: 'light',
    category: 'appearance',
    description: 'Editor color theme',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    key: 'auto_save',
    value: true,
    category: 'general',
    description: 'Automatically save changes',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    key: 'ai_enabled',
    value: false,
    category: 'ai',
    description: 'Enable AI assistance features',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Seed the database with sample data
 */
export async function seedDatabase(): Promise<{
  success: boolean;
  message: string;
  counts?: {
    documents: number;
    scenes: number;
    entities: number;
    settings: number;
  };
}> {
  try {
    // Check if already seeded
    if (await isDatabaseSeeded()) {
      return {
        success: false,
        message: 'Database has already been seeded',
      };
    }

    // Add sample documents
    const documentIds: number[] = [];
    for (const doc of sampleDocuments) {
      const id = await db.documents.add(doc);
      documentIds.push(id);
    }

    // Add sample scenes linked to the first document
    const sceneIds: number[] = [];
    if (documentIds.length > 0) {
      for (const scene of sampleScenes) {
        const id = await db.scenes.add({
          ...scene,
          documentId: documentIds[0]!,
        });
        sceneIds.push(id);
      }
    }

    // Add sample entities
    const entityIds: number[] = [];
    for (const entity of sampleEntities) {
      const id = await db.entities.add(entity);
      entityIds.push(id);
    }

    // Add sample settings
    const settingIds: number[] = [];
    for (const setting of sampleSettings) {
      const id = await db.settings.add(setting);
      settingIds.push(id);
    }

    // Mark as seeded
    await markAsSeeded();

    return {
      success: true,
      message: 'Database seeded successfully with sample data',
      counts: {
        documents: documentIds.length,
        scenes: sceneIds.length,
        entities: entityIds.length,
        settings: settingIds.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to seed database: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Reset and reseed the database
 */
export async function resetAndReseed(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Clear all tables
    await Promise.all([
      db.documents.clear(),
      db.scenes.clear(),
      db.entities.clear(),
      db.snapshots.clear(),
      db.settings.clear(),
      db.apiKeys.clear(),
      db.chunks.clear(),
    ]);

    // Reseed
    const result = await seedDatabase();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Failed to reset database: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Initialize database on app startup
 */
export async function initializeDatabase(): Promise<void> {
  const seeded = await isDatabaseSeeded();
  if (!seeded) {
    await seedDatabase();
  }
}
