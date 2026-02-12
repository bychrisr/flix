import type { ReactNode } from 'react';
import { Text } from '../atoms/Text';

type NavItem = { label: string; href: string; active?: boolean };

type AppTopNavProps = {
  brand: string;
  items: NavItem[];
  rightSlot?: ReactNode;
};

export const AppTopNav = ({ brand, items, rightSlot }: AppTopNavProps) => (
  <nav
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--fx-space-4)',
      flexWrap: 'wrap',
    }}
  >
    <Text as="strong" variant="display-small" style={{ textTransform: 'uppercase' }}>
      {brand}
    </Text>
    <div style={{ display: 'flex', gap: 'var(--fx-space-2)', flexWrap: 'wrap' }}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          style={{
            color: item.active ? 'var(--fx-color-text-primary)' : 'var(--fx-color-text-secondary)',
            textDecoration: 'none',
          }}
        >
          {item.label}
        </a>
      ))}
    </div>
    {rightSlot}
  </nav>
);
