import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';

type AdminContentTemplateProps = {
  leftTitle: string;
  rightTitle: string;
  left: ReactNode;
  right: ReactNode;
};

export const AdminContentTemplate = ({ leftTitle, rightTitle, left, right }: AdminContentTemplateProps) => (
  <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--fx-space-4)' }}>
    <Card>
      <h2 style={{ marginTop: 0 }}>{leftTitle}</h2>
      {left}
    </Card>
    <Card>
      <h2 style={{ marginTop: 0 }}>{rightTitle}</h2>
      {right}
    </Card>
  </section>
);
