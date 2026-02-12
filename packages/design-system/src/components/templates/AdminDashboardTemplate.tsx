import type { ReactNode } from 'react';
import { AdminHeader } from '../organisms/AdminHeader';
import { AppTopNav } from '../organisms/AppTopNav';

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
    <AdminHeader title={title} subtitle={subtitle} onLogout={onLogout} />
    <AppTopNav brand="Flix" items={navItems} />
    {children}
  </main>
);
