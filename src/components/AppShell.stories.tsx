import type { Meta, StoryObj } from '@storybook/react';
import AppShell from './AppShell';

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4">Custom Content</h2>
        <p className="text-gray-600">
          This is a custom content area that can be passed to the AppShell component.
        </p>
      </div>
    ),
  },
};
