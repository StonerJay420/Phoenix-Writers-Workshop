import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: () => <ModalWrapper title="Default Modal">This is a default modal content.</ModalWrapper>,
};

export const Small: Story = {
  render: () => (
    <ModalWrapper title="Small Modal" size="sm">
      This is a small modal.
    </ModalWrapper>
  ),
};

export const Medium: Story = {
  render: () => (
    <ModalWrapper title="Medium Modal" size="md">
      This is a medium modal with some content.
    </ModalWrapper>
  ),
};

export const Large: Story = {
  render: () => (
    <ModalWrapper title="Large Modal" size="lg">
      This is a large modal with more content. You can put longer descriptions and more detailed
      information here.
    </ModalWrapper>
  ),
};

export const ExtraLarge: Story = {
  render: () => (
    <ModalWrapper title="Extra Large Modal" size="xl">
      <p className="mb-4">
        This is an extra large modal with even more content space. Perfect for forms or detailed
        information.
      </p>
      <p>You can include multiple paragraphs and other elements here.</p>
    </ModalWrapper>
  ),
};

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Footer</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Action"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          }
        >
          Are you sure you want to perform this action? This cannot be undone.
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="User Information"
          size="lg"
          footer={
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Save</Button>
            </div>
          }
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message..."
              />
            </div>
          </form>
        </Modal>
      </>
    );
  },
};

export const NoCloseButton: Story = {
  render: () => (
    <ModalWrapper title="No Close Button" showCloseButton={false}>
      This modal has no close button. Close it by clicking outside or pressing Escape.
    </ModalWrapper>
  ),
};

export const NoOverlayClose: Story = {
  render: () => (
    <ModalWrapper title="No Overlay Close" closeOnOverlayClick={false}>
      This modal cannot be closed by clicking the overlay. Use the close button or Escape key.
    </ModalWrapper>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ModalWrapper title="Long Content Modal" size="lg">
      <div className="space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium.
        </p>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
      </div>
    </ModalWrapper>
  ),
};
