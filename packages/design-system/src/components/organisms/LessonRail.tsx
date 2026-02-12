import type { ReactNode } from 'react';
import { LessonTile } from '../molecules/LessonTile';

type LessonRailItem = {
  id: string;
  title: string;
  status: 'released' | 'locked' | 'expired';
  action?: ReactNode;
};

type LessonRailProps = {
  title: string;
  items: LessonRailItem[];
};

export const LessonRail = ({ title, items }: LessonRailProps): ReactNode => (
  <section>
    <h3>{title}</h3>
    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'minmax(240px, 1fr)',
        gap: 'var(--fx-space-3)',
        overflowX: 'auto',
      }}
    >
      {items.map((item) => (
        <li key={item.id}>
          <LessonTile title={item.title} status={item.status} action={item.action} />
        </li>
      ))}
    </ul>
  </section>
);
