import type { Meta, StoryObj } from '@storybook/react';
import { StoreDemo } from './StoreDemo';

const meta = {
  title: 'Components/StoreDemo',
  component: StoreDemo,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StoreDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
