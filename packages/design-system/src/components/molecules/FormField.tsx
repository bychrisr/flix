import type { ReactNode } from 'react';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
};

export const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  hint,
}: FormFieldProps): ReactNode => (
  <label style={{ display: 'grid', gap: 'var(--fx-space-2)' }}>
    <Text as="span" tone="secondary" size="caption">
      {label}
    </Text>
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={(event) => onChange(event.target.value)}
    />
    {hint ? (
      <Text as="span" tone="tertiary" size="caption">
        {hint}
      </Text>
    ) : null}
  </label>
);
