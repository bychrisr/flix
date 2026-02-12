import type { ReactNode } from 'react';
import { HomePageHeader, type HomeNavItem } from './HomePageHeader';

type AdminPageHeaderProps = {
  items: HomeNavItem[];
  onLogout: () => void;
};

export const AdminPageHeader = ({ items, onLogout }: AdminPageHeaderProps): ReactNode => (
  <header
    style={{
      width: '100%',
      background: 'var(--fx-color-bg-primary)',
      borderBottom: 'var(--fx-size-border-default) solid var(--fx-color-border-subtle)',
    }}
  >
    <HomePageHeader
      brandLabel="Netflix"
      items={items}
      searchControlLabel="Search"
      notificationsControlLabel="Notifications"
      profileControlLabel="Admin menu"
      onProfileClick={onLogout}
      style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}
    />
  </header>
);
