import type { CSSProperties, ReactNode } from 'react';
import type { IconName } from '../../assets/icons';
import { Text } from '../atoms/Text';
import { ProfileAvatar } from '../atoms/ProfileAvatar';
import { ProfileMenuItem } from '../molecules/ProfileMenuItem';

export type ProfileMenuAccount = {
  id: string;
  label: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  ariaLabel: string;
  onClick?: () => void;
};

export type ProfileMenuAction = {
  id: string;
  label: ReactNode;
  ariaLabel: string;
  iconName?: IconName;
  muted?: boolean;
  onClick?: () => void;
};

type ProfileMenuPatternProps = {
  accounts: ProfileMenuAccount[];
  actions: ProfileMenuAction[];
  footerAction?: {
    label: ReactNode;
    ariaLabel: string;
    onClick?: () => void;
  };
  showTopPointer?: boolean;
  style?: CSSProperties;
};

const rootStyle: CSSProperties = {
  width: 'var(--fx-size-pattern-profile-menu-width)',
  minHeight: 'var(--fx-size-pattern-profile-menu-min-height)',
  border: '1px solid var(--fx-color-profile-menu-border)',
  background: 'var(--fx-color-profile-menu-background)',
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto',
};

const sectionStyle: CSSProperties = {
  padding: 'var(--fx-space-4) var(--fx-space-3)',
  display: 'grid',
  gap: 'var(--fx-space-3)',
};

const accountRowStyle: CSSProperties = {
  width: '100%',
  border: 0,
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  display: 'grid',
  gridTemplateColumns: 'var(--fx-size-pattern-profile-avatar-sm-size) auto',
  alignItems: 'center',
  gap: 'var(--fx-space-3)',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 0,
  margin: 0,
};

const dividerStyle: CSSProperties = {
  width: '100%',
  height: '1px',
  background: 'var(--fx-color-profile-menu-border)',
};

const footerStyle: CSSProperties = {
  minHeight: 'var(--fx-size-pattern-profile-menu-footer-height)',
  borderTop: '1px solid var(--fx-color-profile-menu-border)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 var(--fx-space-3)',
};

export const ProfileMenuPattern = ({
  accounts,
  actions,
  footerAction,
  showTopPointer = true,
  style,
}: ProfileMenuPatternProps): ReactNode => (
  <aside style={{ ...rootStyle, ...style }}>
    {showTopPointer ? (
      <div style={{ padding: '0 var(--fx-space-8)', height: '6px', display: 'flex', justifyContent: 'flex-end' }}>
        <span
          aria-hidden="true"
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid var(--fx-color-profile-menu-border)',
            transform: 'translateY(-6px)',
          }}
        />
      </div>
    ) : null}

    <div style={sectionStyle}>
      {accounts.map((account) => (
        <button key={account.id} type="button" onClick={account.onClick} aria-label={account.ariaLabel} style={accountRowStyle}>
          <ProfileAvatar
            imageUrl={account.imageUrl}
            imageAlt={account.imageAlt}
            size="sm"
            interactive={false}
          />
          <Text as="span" variant="regular-small-body-normal">{account.label}</Text>
        </button>
      ))}
    </div>

    <div style={dividerStyle} />

    <div style={{ ...sectionStyle, alignContent: 'start' }}>
      {actions.map((action) => (
        <ProfileMenuItem
          key={action.id}
          label={action.label}
          iconName={action.iconName}
          muted={action.muted}
          ariaLabel={action.ariaLabel}
          onClick={action.onClick}
        />
      ))}
    </div>

    {footerAction ? (
      <button
        type="button"
        onClick={footerAction.onClick}
        aria-label={footerAction.ariaLabel}
        style={{ ...footerStyle, padding: 0, margin: 0, background: 'transparent', width: '100%' }}
      >
        <Text as="span" variant="regular-small-body-normal">{footerAction.label}</Text>
      </button>
    ) : (
      <div />
    )}
  </aside>
);
