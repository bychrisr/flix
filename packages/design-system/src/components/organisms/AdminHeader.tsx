import type { ReactNode } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

type AdminHeaderProps = {
  title: string;
  subtitle: string;
  onLogout: () => void;
};

export const AdminHeader = ({ title, subtitle, onLogout }: AdminHeaderProps): ReactNode => (
  <header style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--fx-space-4)', alignItems: 'start' }}>
    <div>
      <h1 style={{ margin: 0, fontFamily: 'var(--fx-font-display)', fontSize: 'var(--fx-text-display)' }}>{title}</h1>
      <Text tone="secondary" style={{ marginTop: 'var(--fx-space-2)' }}>
        {subtitle}
      </Text>
    </div>
    <Button variant="secondary" onClick={onLogout}>
      Logout
    </Button>
  </header>
);
