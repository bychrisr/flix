import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { AdminPageHeader } from '../organisms/AdminPageHeader';

type AdminDashboardTemplateProps = {
  title: string;
  subtitle: string;
  onLogout: () => void;
  navItems: { label: string; href: string; active?: boolean }[];
  children: ReactNode;
};

export const AdminDashboardTemplate = ({
  title,
  subtitle,
  onLogout,
  navItems,
  children,
}: AdminDashboardTemplateProps) => (
  <main style={{ width: '100%', display: 'grid', gap: 'var(--fx-space-4)' }}>
    <AdminPageHeader items={navItems} onLogout={onLogout} />
    <section
      style={{
        maxWidth: 1200,
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gap: 'var(--fx-space-4)',
        padding: '0 var(--fx-space-6) var(--fx-space-6)',
        boxSizing: 'border-box',
      }}
    >
      <Card>
        <Text as="h1" variant="display-large" style={{ margin: 0 }}>
          {title}
        </Text>
        <Text tone="secondary" variant="regular-body" style={{ marginTop: 'var(--fx-space-2)' }}>
          {subtitle}
        </Text>
      </Card>
      {children}
    </section>
  </main>
);
