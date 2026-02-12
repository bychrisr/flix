import type { ReactNode } from 'react';
import { Badge } from '../atoms/Badge';
import { Card } from '../atoms/Card';
import { Text } from '../atoms/Text';

type LessonTileProps = {
  title: string;
  status: 'released' | 'locked' | 'expired';
  action?: ReactNode;
};

export const LessonTile = ({ title, status, action }: LessonTileProps): ReactNode => (
  <Card
    style={{
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 'var(--fx-space-3)',
      background: 'linear-gradient(180deg, rgb(0 0 0 / 30%) 0%, rgb(0 0 0 / 75%) 100%), var(--fx-color-bg-card)',
    }}
  >
    <div>
      <Text as="strong">{title}</Text>
      <div style={{ marginTop: 'var(--fx-space-2)' }}>
        <Badge variant={status}>{status}</Badge>
      </div>
    </div>
    {action}
  </Card>
);
