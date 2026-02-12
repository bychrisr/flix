import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../atoms/Text';

export type VideoOptionItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  selected?: boolean;
  onSelect?: () => void;
};

type VideoOptionMenuProps = {
  title: ReactNode;
  options: VideoOptionItem[];
  style?: CSSProperties;
};

const panelStyle: CSSProperties = {
  width: 'min(100%, var(--fx-size-pattern-player-option-panel-width))',
  maxHeight: 'var(--fx-size-pattern-player-option-panel-height)',
  background: 'var(--fx-color-player-surface)',
  borderRadius: 'var(--fx-radius-input)',
  overflow: 'hidden',
  display: 'grid',
  alignContent: 'start',
};

const headingStyle: CSSProperties = {
  padding: 'var(--fx-space-4) var(--fx-space-6)',
  borderBottom: '1px solid var(--fx-color-player-panel-muted)',
};

const itemStyle: CSSProperties = {
  width: '100%',
  border: 0,
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 'var(--fx-space-4) var(--fx-space-6)',
  display: 'grid',
  gap: 'var(--fx-space-1)',
};

export const VideoOptionMenu = ({ title, options, style }: VideoOptionMenuProps): ReactNode => (
  <section style={{ ...panelStyle, ...style }}>
    <div style={headingStyle}>
      <Text as="h4" variant="medium-headline2" style={{ margin: 0 }}>{title}</Text>
    </div>

    <div style={{ overflow: 'auto' }}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={option.onSelect}
          style={{
            ...itemStyle,
            background: option.selected ? 'var(--fx-color-player-panel-soft)' : 'transparent',
          }}
        >
          <Text as="span" variant="regular-body">{option.label}</Text>
          {option.description ? (
            <Text as="span" variant="regular-caption1" tone="secondary">{option.description}</Text>
          ) : null}
        </button>
      ))}
    </div>
  </section>
);
