import type { Meta, StoryObj } from '@storybook/react';
import { ZenEditor } from './ZenEditor';

const meta = {
  title: 'Modules/ZenEditor',
  component: ZenEditor,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ZenEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialContent: '<p>Start writing your story here...</p>',
    placeholder: 'Begin typing...',
  },
};

export const WithContent: Story = {
  args: {
    initialContent: `
      <h1>Welcome to Zen Editor</h1>
      <p>This is a powerful editor with Markdown and WYSIWYG support.</p>
      <h2>Features</h2>
      <ul>
        <li>Rich text formatting</li>
        <li>Markdown mode</li>
        <li>Typewriter scroll</li>
        <li>Focus mode</li>
        <li>Autosave</li>
      </ul>
      <blockquote>
        <p>"Writing is thinking. To write well is to think clearly."</p>
      </blockquote>
    `,
    placeholder: 'Start writing...',
  },
};

export const MarkdownContent: Story = {
  args: {
    initialContent: `# Hello World

This is a **bold** statement and this is *italic*.

## Lists

- Item 1
- Item 2
- Item 3

## Code

\`inline code\` looks like this.

> Blockquotes are nice too!
`,
    placeholder: 'Write in Markdown...',
  },
};
