import type { Editor } from '@tiptap/react';

/**
 * Editor types and interfaces
 */

export type EditorMode = 'wysiwyg' | 'markdown';

export interface ZenEditorProps {
  documentId?: number;
  initialContent?: string;
  placeholder?: string;
  onSave?: (content: string) => void;
  onChange?: (content: string) => void;
  autosaveDelay?: number;
  className?: string;
}

export interface EditorToolbarProps {
  editor: Editor | null;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  typewriterMode: boolean;
  onTypewriterModeChange: (enabled: boolean) => void;
  focusMode: boolean;
  onFocusModeChange: (enabled: boolean) => void;
}

export interface EditorSettings {
  mode: EditorMode;
  typewriterMode: boolean;
  focusMode: boolean;
  fontSize: number;
  lineHeight: number;
}
