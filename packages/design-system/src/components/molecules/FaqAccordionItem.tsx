import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { FaqToggleIcon } from '../atoms/FaqToggleIcon';
import { Text } from '../atoms/Text';

type FaqAnswerContent = ReactNode | string | string[];

export type FaqAccordionItemProps = {
  id: string;
  question: string;
  answer: FaqAnswerContent;
  expanded: boolean;
  onToggle: () => void;
  style?: CSSProperties;
};

const itemStyle: CSSProperties = {
  background: 'var(--fx-color-faq-item-background-default)',
};

const triggerStyle: CSSProperties = {
  width: '100%',
  minHeight: 'var(--fx-size-pattern-faq-item-min-height)',
  padding: 'var(--fx-space-4) var(--fx-size-pattern-faq-item-padding-x)',
  border: 0,
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-4)',
  cursor: 'pointer',
};

const answerStyle: CSSProperties = {
  borderTop: 'var(--fx-size-border-default) solid var(--fx-color-faq-divider)',
  background: 'var(--fx-color-faq-answer-background)',
  padding: 'var(--fx-space-6) var(--fx-size-pattern-faq-item-padding-x)',
  display: 'grid',
  gap: 'var(--fx-size-pattern-faq-answer-gap)',
};

const textStyle: CSSProperties = {
  margin: 0,
  fontSize: 'var(--fx-size-pattern-faq-text-size)',
  lineHeight: 'var(--fx-size-pattern-faq-text-line-height)',
};

const renderAnswer = (answer: FaqAnswerContent) => {
  if (Array.isArray(answer)) {
    return answer.map((paragraph, index) => (
      <Text key={`${index}-${paragraph}`} as="p" variant="regular-title3" style={textStyle}>
        {paragraph}
      </Text>
    ));
  }

  if (typeof answer === 'string') {
    return (
      <Text as="p" variant="regular-title3" style={textStyle}>
        {answer}
      </Text>
    );
  }

  return answer;
};

export const FaqAccordionItem = ({ id, question, answer, expanded, onToggle, style }: FaqAccordionItemProps) => {
  const [hovered, setHovered] = useState(false);
  const triggerId = `faq-trigger-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <article
      style={{
        ...itemStyle,
        background: hovered
          ? 'var(--fx-color-faq-item-background-hover)'
          : 'var(--fx-color-faq-item-background-default)',
        ...style,
      }}
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={triggerStyle}
      >
        <Text as="span" variant="regular-title2" style={textStyle}>
          {question}
        </Text>
        <FaqToggleIcon expanded={expanded} />
      </button>

      {expanded ? (
        <div id={panelId} role="region" aria-labelledby={triggerId} style={answerStyle}>
          {renderAnswer(answer)}
        </div>
      ) : null}
    </article>
  );
};
