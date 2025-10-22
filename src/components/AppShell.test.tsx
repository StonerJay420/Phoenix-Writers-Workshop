import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppShell from './AppShell';

describe('AppShell', () => {
  it('renders without crashing', () => {
    render(<AppShell />);
    expect(screen.getByText('Phoenix Workshop')).toBeInTheDocument();
  });

  it('displays the welcome message', () => {
    render(<AppShell />);
    expect(screen.getByText('Welcome to Phoenix Workshop')).toBeInTheDocument();
  });

  it('toggles sidebar when button is clicked', () => {
    render(<AppShell />);
    const toggleButton = screen.getByLabelText('Toggle sidebar');
    const sidebar = screen.getByRole('complementary');

    // Sidebar should be open by default
    expect(sidebar).toHaveClass('w-64');

    // Click to close
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('w-0');

    // Click to open
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('w-64');
  });

  it('renders custom children when provided', () => {
    render(
      <AppShell>
        <div>Custom Content</div>
      </AppShell>
    );
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});
