import type { ReactNode } from 'react';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';
import { HomePageHeader } from '../organisms/HomePageHeader';

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
  <main style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 'var(--fx-space-4)', padding: 'var(--fx-space-6)' }}>
    <Card style={{ background: 'var(--fx-color-bg-primary)', padding: 0 }}>
      <HomePageHeader
        brandLabel="Netflix"
        items={navItems}
        searchControlLabel="Search"
        notificationsControlLabel="Notifications"
        profileControlLabel="Admin menu"
        onProfileClick={onLogout}
      />
    </Card>
    <Card>
      <Text as="h1" variant="display-large" style={{ margin: 0 }}>
        {title}
      </Text>
      <Text tone="secondary" variant="regular-body" style={{ marginTop: 'var(--fx-space-2)' }}>
        {subtitle}
      </Text>
    </Card>
    {children}
  </main>
);
