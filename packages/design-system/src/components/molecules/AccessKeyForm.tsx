import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

type AccessKeyFormProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
};

export const AccessKeyForm = ({ value, onChange, onSubmit, loading, submitLabel = 'Load catalog' }: AccessKeyFormProps): ReactNode => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--fx-space-2)' }}>
    <Input
      placeholder="Event access key (optional)"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    <Button type="button" onClick={onSubmit} disabled={loading}>
      {loading ? 'Loading...' : submitLabel}
    </Button>
  </div>
);
