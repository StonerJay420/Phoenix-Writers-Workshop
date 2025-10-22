/**
 * Database table interfaces for Phoenix Workshop
 */

// Document interface
export interface Document {
  id?: number;
  title: string;
  content: string;
  projectId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Scene interface
export interface Scene {
  id?: number;
  documentId: number;
  title: string;
  content: string;
  order: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Entity types
export type EntityType = 'character' | 'location' | 'item' | 'concept' | 'event' | 'other';

export interface Entity {
  id?: number;
  type: EntityType;
  name: string;
  description: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Snapshot interface for version control
export interface Snapshot {
  id?: number;
  documentId: number;
  content: string;
  timestamp: Date;
  label?: string;
  metadata?: Record<string, unknown>;
}

// Settings interface
export type SettingCategory = 'general' | 'editor' | 'ai' | 'export' | 'appearance' | 'other';

export interface Setting {
  id?: number;
  key: string;
  value: string | number | boolean | object;
  category: SettingCategory;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Keys interface
export type APIService = 'openai' | 'anthropic' | 'google' | 'azure' | 'custom' | 'other';

export interface APIKey {
  id?: number;
  service: APIService;
  name: string;
  encryptedValue: string;
  isActive: boolean;
  lastUsed?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Chunk interface for text processing
export interface Chunk {
  id?: number;
  documentId: number;
  content: string;
  position: number;
  startOffset: number;
  endOffset: number;
  metadata?: Record<string, unknown>;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}
