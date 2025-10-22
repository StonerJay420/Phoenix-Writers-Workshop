import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('does not render helper text when error is present', () => {
    render(<Input helperText="Helper" error="Error message" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies full width styles', () => {
    const { container } = render(<Input fullWidth />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('w-full');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Error message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders left icon when provided', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">Icon</span>}
        placeholder="Search"
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders right icon when provided', () => {
    render(
      <Input
        rightIcon={<span data-testid="right-icon">Icon</span>}
        placeholder="Email"
      />
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies small size styles', () => {
    render(<Input inputSize="sm" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-sm');
  });

  it('applies large size styles', () => {
    render(<Input inputSize="lg" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('text-lg');
  });
});
