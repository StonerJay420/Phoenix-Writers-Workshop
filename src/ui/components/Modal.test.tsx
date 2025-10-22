import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        Content
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal isOpen onClose={vi.fn()} footer={<div>Footer Content</div>}>
        Content
      </Modal>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} title="Title">
        Content
      </Modal>
    );
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked and closeOnOverlayClick is true', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={handleClose} closeOnOverlayClick>
        Content
      </Modal>
    );
    // Find the backdrop div with the bg-black class
    const backdrop = container.querySelector('.bg-black') as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen onClose={handleClose} closeOnOverlayClick={false}>
        Content
      </Modal>
    );
    // Find the backdrop div with the bg-black class
    const backdrop = container.querySelector('.bg-black') as HTMLElement;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).not.toHaveBeenCalled();
    }
  });

  it('calls onClose when Escape key is pressed and closeOnEscape is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} closeOnEscape>
        Content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key is pressed and closeOnEscape is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} closeOnEscape={false}>
        Content
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Title" showCloseButton={false}>
        Content
      </Modal>
    );
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(
      <Modal isOpen onClose={vi.fn()} size="sm">
        Content
      </Modal>
    );
    let modalContent = container.querySelector('.max-w-sm');
    expect(modalContent).toBeInTheDocument();

    rerender(
      <Modal isOpen onClose={vi.fn()} size="lg">
        Content
      </Modal>
    );
    modalContent = container.querySelector('.max-w-lg');
    expect(modalContent).toBeInTheDocument();
  });
});
