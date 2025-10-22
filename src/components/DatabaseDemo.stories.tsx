import type { Meta, StoryObj } from '@storybook/react';
import { DatabaseDemo } from './DatabaseDemo';

const meta = {
  title: 'Components/DatabaseDemo',
  component: DatabaseDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatabaseDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
