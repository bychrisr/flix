import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type StatTileProps = {
  label: string;
  value: string | number;
};

export const StatTile = ({ label, value }: StatTileProps): ReactNode => (
  <Card>
    <Text tone="secondary" size="caption">
      {label}
    </Text>
    <Text as="strong" size="title" style={{ display: 'block', marginTop: 'var(--fx-space-2)' }}>
      {value}
    </Text>
  </Card>
);
