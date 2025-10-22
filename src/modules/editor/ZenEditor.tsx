import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { EditorToolbar } from './EditorToolbar';
import type { ZenEditorProps, EditorMode } from './types';
import { db } from '../../core/db';

export const ZenEditor: React.FC<ZenEditorProps> = ({
  documentId,
  initialContent = '',
  placeholder = 'Start writing...',
  onSave,
  onChange,
  autosaveDelay = 2000,
  className = '',
}) => {
  const [mode, setMode] = useState<EditorMode>('wysiwyg');
  const [typewriterMode, setTypewriterMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none ${
          focusMode ? 'zen-focus-mode' : ''
        }`,
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const html = updatedEditor.getHTML();
      onChange?.(html);

      // Trigger autosave
      if (documentId) {
        scheduleAutosave(html);
      }
    },
  });

  // Convert HTML to Markdown (simple conversion)
  const htmlToMarkdown = useCallback((html: string): string => {
    let markdown = html;

    // Remove wrapping <p> tags
    markdown = markdown.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n');

    // Headings
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n');

    // Bold and italic
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<s>(.*?)<\/s>/g, '~~$1~~');

    // Lists
    markdown = markdown.replace(/<ul>/g, '').replace(/<\/ul>/g, '\n');
    markdown = markdown.replace(/<ol>/g, '').replace(/<\/ol>/g, '\n');
    markdown = markdown.replace(/<li>/g, '- ').replace(/<\/li>/g, '\n');

    // Code
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
    markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n');

    // Blockquote
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gs, (match, content) => {
      return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n';
    });

    // Links
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    markdown = markdown.trim();

    return markdown;
  }, []);

  // Convert Markdown to HTML (simple conversion)
  const markdownToHtml = useCallback((markdown: string): string => {
    let html = markdown;

    // Headings
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Bold, italic, strikethrough
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Lists (basic)
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Blockquotes
    html = html.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[a-z]/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');

    return html;
  }, []);

  // Handle mode switching
  const handleModeChange = useCallback((newMode: EditorMode) => {
    if (!editor) return;

    if (newMode === 'markdown' && mode === 'wysiwyg') {
      // Switch to Markdown mode
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      setMarkdownContent(markdown);
      setMode('markdown');
    } else if (newMode === 'wysiwyg' && mode === 'markdown') {
      // Switch to WYSIWYG mode
      const html = markdownToHtml(markdownContent);
      editor.commands.setContent(html);
      setMode('wysiwyg');
    }
  }, [editor, mode, markdownContent, htmlToMarkdown, markdownToHtml]);

  // Handle markdown text area changes
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const markdown = e.target.value;
    setMarkdownContent(markdown);

    // Trigger autosave
    if (documentId) {
      const html = markdownToHtml(markdown);
      scheduleAutosave(html);
    }
  };

  // Autosave functionality
  const scheduleAutosave = useCallback((content: string) => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);

        if (documentId) {
          // Save to Dexie
          await db.documents.update(documentId, {
            content,
            updatedAt: new Date(),
          });
        }

        onSave?.(content);
      } catch (error) {
        console.error('Autosave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, autosaveDelay);
  }, [documentId, onSave, autosaveDelay]);

  // Typewriter mode scroll effect
  useEffect(() => {
    if (!typewriterMode || !editorContainerRef.current || !editor) return;

    const handleScroll = () => {
      const container = editorContainerRef.current;
      if (!container) return;

      const editorElement = container.querySelector('.ProseMirror');
      if (!editorElement) return;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Keep cursor in the middle of the viewport
      const targetY = containerRect.top + containerRect.height / 2;
      const currentY = rect.top;
      const diff = currentY - targetY;

      if (Math.abs(diff) > 50) {
        container.scrollTop += diff;
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('input', handleScroll);
    editorElement.addEventListener('click', handleScroll);

    return () => {
      editorElement.removeEventListener('input', handleScroll);
      editorElement.removeEventListener('click', handleScroll);
    };
  }, [typewriterMode, editor]);

  // Cleanup autosave timer
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <EditorToolbar
        editor={editor}
        mode={mode}
        onModeChange={handleModeChange}
        typewriterMode={typewriterMode}
        onTypewriterModeChange={setTypewriterMode}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
      />

      {/* Editor Area */}
      <div
        ref={editorContainerRef}
        className="flex-1 overflow-auto bg-white"
      >
        <div
          className={`max-w-4xl mx-auto px-8 py-12 ${
            typewriterMode ? 'min-h-screen' : ''
          }`}
        >
          {mode === 'wysiwyg' ? (
            <EditorContent editor={editor} />
          ) : (
            <textarea
              value={markdownContent}
              onChange={handleMarkdownChange}
              className="w-full min-h-screen p-4 font-mono text-base border-none resize-none focus:outline-none bg-transparent"
              placeholder={placeholder}
            />
          )}
        </div>
      </div>

      {/* Autosave Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}

      {/* Focus Mode Styles */}
      <style>{`
        .zen-focus-mode p:not(:has(+ p)):not(:last-child),
        .zen-focus-mode h1:not(:has(+ h1)):not(:last-child),
        .zen-focus-mode h2:not(:has(+ h2)):not(:last-child),
        .zen-focus-mode h3:not(:has(+ h3)):not(:last-child),
        .zen-focus-mode li:not(:has(+ li)):not(:last-child),
        .zen-focus-mode blockquote:not(:has(+ blockquote)):not(:last-child) {
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .zen-focus-mode p:hover,
        .zen-focus-mode h1:hover,
        .zen-focus-mode h2:hover,
        .zen-focus-mode h3:hover,
        .zen-focus-mode li:hover,
        .zen-focus-mode blockquote:hover,
        .zen-focus-mode p:focus-within,
        .zen-focus-mode h1:focus-within,
        .zen-focus-mode h2:focus-within,
        .zen-focus-mode h3:focus-within,
        .zen-focus-mode li:focus-within,
        .zen-focus-mode blockquote:focus-within {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ZenEditor;
