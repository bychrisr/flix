import type { CSSProperties } from 'react';
import { Dropdown, type DropdownOption } from '../atoms/Dropdown';

type BrowseLanguagePatternProps = {
  originalLanguageOptions: DropdownOption[];
  languageOptions: DropdownOption[];
  suggestionOptions: DropdownOption[];
  originalLanguageValue?: string;
  languageValue?: string;
  suggestionValue?: string;
  onOriginalLanguageChange?: (value: string, option: DropdownOption) => void;
  onLanguageChange?: (value: string, option: DropdownOption) => void;
  onSuggestionChange?: (value: string, option: DropdownOption) => void;
  style?: CSSProperties;
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--fx-space-2)',
  flexWrap: 'wrap',
};

export const BrowseLanguagePattern = ({
  originalLanguageOptions,
  languageOptions,
  suggestionOptions,
  originalLanguageValue,
  languageValue,
  suggestionValue,
  onOriginalLanguageChange,
  onLanguageChange,
  onSuggestionChange,
  style,
}: BrowseLanguagePatternProps) => (
  <div style={{ ...rowStyle, ...style }}>
    <Dropdown
      ariaLabel="Original language"
      variant="browse"
      surface="black"
      options={originalLanguageOptions}
      value={originalLanguageValue}
      onChange={onOriginalLanguageChange}
      placeholder="Original Language"
    />
    <Dropdown
      ariaLabel="Language"
      variant="browse"
      surface="black"
      options={languageOptions}
      value={languageValue}
      onChange={onLanguageChange}
      placeholder="English"
    />
    <Dropdown
      ariaLabel="Suggestions"
      variant="browse"
      surface="black"
      options={suggestionOptions}
      value={suggestionValue}
      onChange={onSuggestionChange}
      placeholder="Suggestions For You"
    />
  </div>
);
