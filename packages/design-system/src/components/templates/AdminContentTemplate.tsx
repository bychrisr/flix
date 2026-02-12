import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type AdminContentTemplateProps = {
  leftTitle: string;
  rightTitle: string;
  left: ReactNode;
  right: ReactNode;
};

export const AdminContentTemplate = ({ leftTitle, rightTitle, left, right }: AdminContentTemplateProps) => (
  <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--fx-space-6)' }}>
    <Card>
      <Text as="h2" variant="medium-title2" style={{ marginTop: 0 }}>
        {leftTitle}
      </Text>
      {left}
    </Card>
    <Card>
      <Text as="h2" variant="medium-title2" style={{ marginTop: 0 }}>
        {rightTitle}
      </Text>
      {right}
    </Card>
  </section>
);
