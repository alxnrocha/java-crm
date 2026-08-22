import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tabs } from '@/components/ui/Tabs';

describe('UI Primitives Components', () => {
  it('renders Button with variants and loading state', () => {
    const { rerender } = render(<Button variant="primary">Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();

    rerender(<Button isLoading>Loading State</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders Badge with status colors and dot indicator', () => {
    render(<Badge variant="active" withDot>Active Status</Badge>);
    expect(screen.getByText('Active Status')).toBeInTheDocument();
  });

  it('renders Card with header and content', () => {
    render(
      <Card>
        <CardTitle>Total ARR</CardTitle>
        <CardDescription>Annual Recurring Revenue</CardDescription>
      </Card>
    );
    expect(screen.getByText('Total ARR')).toBeInTheDocument();
    expect(screen.getByText('Annual Recurring Revenue')).toBeInTheDocument();
  });

  it('renders Input and Select form fields with labels', () => {
    render(
      <div>
        <Input label="Contract Number" placeholder="CTR-2026-001" />
        <Select label="Billing Term" options={[{ value: 'annual', label: 'Annual' }]} />
      </div>
    );
    expect(screen.getByLabelText('Contract Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Billing Term')).toBeInTheDocument();
  });

  it('renders Skeleton and Tabs components', () => {
    render(
      <div>
        <Skeleton data-testid="skeleton-el" className="w-20 h-4" />
        <Tabs
          tabs={[
            { id: 'all', label: 'All Contracts', count: 127 },
            { id: 'active', label: 'Active', count: 68 },
          ]}
          activeTab="all"
          onChange={() => {}}
        />
      </div>
    );
    expect(screen.getByTestId('skeleton-el')).toBeInTheDocument();
    expect(screen.getByText('All Contracts')).toBeInTheDocument();
    expect(screen.getByText('127')).toBeInTheDocument();
  });
});
