import type { CSSProperties, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { FaqAccordionItem } from '../molecules/FaqAccordionItem';

export type FaqQuestionItem = {
  id: string;
  question: string;
  answer: ReactNode | string | string[];
};

type FaqQuestionsPatternProps = {
  items: FaqQuestionItem[];
  defaultExpandedId?: string | null;
  expandedIds?: string[];
  allowMultipleExpanded?: boolean;
  onExpandedIdsChange?: (ids: string[]) => void;
  style?: CSSProperties;
};

const layoutStyle: CSSProperties = {
  width: '100%',
  maxWidth: 'var(--fx-size-pattern-faq-max-width)',
  margin: 0,
  display: 'grid',
  gap: 'var(--fx-size-pattern-faq-item-gap)',
};

export const FaqQuestionsPattern = ({
  items,
  defaultExpandedId = null,
  expandedIds,
  allowMultipleExpanded = false,
  onExpandedIdsChange,
  style,
}: FaqQuestionsPatternProps) => {
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(
    defaultExpandedId ? [defaultExpandedId] : [],
  );
  const activeExpandedIds = expandedIds ?? internalExpandedIds;
  const expandedSet = useMemo(() => new Set(activeExpandedIds), [activeExpandedIds]);

  const updateExpandedIds = (nextIds: string[]) => {
    if (!expandedIds) {
      setInternalExpandedIds(nextIds);
    }
    onExpandedIdsChange?.(nextIds);
  };

  const toggleItem = (id: string) => {
    if (expandedSet.has(id)) {
      updateExpandedIds(activeExpandedIds.filter((currentId) => currentId !== id));
      return;
    }

    if (allowMultipleExpanded) {
      updateExpandedIds([...activeExpandedIds, id]);
      return;
    }

    updateExpandedIds([id]);
  };

  return (
    <section style={{ ...layoutStyle, ...style }}>
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          id={item.id}
          question={item.question}
          answer={item.answer}
          expanded={expandedSet.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </section>
  );
};
