import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DropdownSurface = 'black' | 'elevated';
type DropdownVariant = 'compact' | 'browse';

type DropdownProps = {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: DropdownOption) => void;
  placeholder?: string;
  disabled?: boolean;
  surface?: DropdownSurface;
  variant?: DropdownVariant;
  width?: CSSProperties['width'];
  maxMenuHeight?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const triggerBase: CSSProperties = {
  width: '100%',
  borderRadius: '0',
  border: '1px solid var(--fx-color-text-primary)',
  color: 'var(--fx-color-text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--fx-space-2)',
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-regular-headline2-size)',
  lineHeight: 'var(--fx-typo-regular-headline2-line)',
  fontWeight: 'var(--fx-typo-regular-headline2-weight)',
  letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
};

const triggerVariants: Record<DropdownVariant, CSSProperties> = {
  compact: {
    height: '26px',
    padding: '0 var(--fx-space-2)',
  },
  browse: {
    height: '37px',
    padding: '0 var(--fx-space-3)',
  },
};

const triggerSurfaces: Record<DropdownSurface, CSSProperties> = {
  black: {
    background: 'var(--fx-color-bg-primary)',
  },
  elevated: {
    background: 'var(--fx-color-bg-card)',
  },
};

const menuStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% - 1px)',
  left: 0,
  right: 0,
  border: '1px solid var(--fx-color-text-primary)',
  background: 'var(--fx-color-bg-primary)',
  zIndex: 50,
  overflowY: 'auto',
};

const optionStyle: CSSProperties = {
  width: '100%',
  border: 0,
  background: 'transparent',
  color: 'var(--fx-color-text-primary)',
  textAlign: 'left',
  padding: '2px var(--fx-space-2)',
  cursor: 'pointer',
  fontFamily: 'var(--fx-font-sans)',
  fontSize: 'var(--fx-typo-regular-headline2-size)',
  lineHeight: 'var(--fx-typo-regular-headline2-line)',
  fontWeight: 'var(--fx-typo-regular-headline2-weight)',
  letterSpacing: 'var(--fx-typo-regular-headline2-spacing)',
  display: 'block',
};

const getNextEnabledIndex = (options: DropdownOption[], start: number, direction: 1 | -1): number => {
  let index = start;
  for (let i = 0; i < options.length; i += 1) {
    index = (index + direction + options.length) % options.length;
    if (!options[index]?.disabled) {
      return index;
    }
  }
  return -1;
};

export const Dropdown = ({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  surface = 'black',
  variant = 'compact',
  width,
  maxMenuHeight = 520,
  ariaLabel,
  className,
  style,
}: DropdownProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [focusVisible, setFocusVisible] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedValue = isControlled ? value : internalValue;
  const resolvedWidth = width ?? (variant === 'browse' ? 245 : 177);
  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === selectedValue),
    [options, selectedValue],
  );
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const node = rootRef.current;
      if (node && !node.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const initialIndex = selectedIndex >= 0 && !options[selectedIndex]?.disabled
      ? selectedIndex
      : getNextEnabledIndex(options, -1, 1);
    setActiveIndex(initialIndex);
  }, [open, selectedIndex, options]);

  useEffect(() => {
    if (!open || activeIndex < 0) {
      return;
    }
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const commitSelection = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) {
      return;
    }
    if (!isControlled) {
      setInternalValue(option.value);
    }
    onChange?.(option.value, option);
    setOpen(false);
    setActiveIndex(index);
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) => getNextEnabledIndex(options, current < 0 ? -1 : current, 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((current) => getNextEnabledIndex(options, current < 0 ? 0 : current, -1));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (activeIndex >= 0) {
        commitSelection(activeIndex);
      }
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => getNextEnabledIndex(options, current < 0 ? -1 : current, 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => getNextEnabledIndex(options, current < 0 ? 0 : current, -1));
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(getNextEnabledIndex(options, -1, 1));
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(getNextEnabledIndex(options, 0, -1));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (activeIndex >= 0) {
        commitSelection(activeIndex);
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={rootRef} className={className} style={{ width: resolvedWidth, position: 'relative', ...style }}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        onKeyDown={onTriggerKeyDown}
        onFocus={() => setFocusVisible(true)}
        onBlur={() => setFocusVisible(false)}
        style={{
          ...triggerBase,
          ...triggerVariants[variant],
          ...triggerSurfaces[surface],
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: focusVisible ? '0 0 0 2px var(--fx-color-text-primary)' : 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M0 0L5 6L10 0H0Z" fill="var(--fx-color-text-primary)" />
        </svg>
      </button>

      {open ? (
        <div role="listbox" aria-label={ariaLabel} tabIndex={-1} onKeyDown={onListKeyDown} style={{ ...menuStyle, maxHeight: maxMenuHeight }}>
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commitSelection(index)}
                style={{
                  ...optionStyle,
                  background: isActive ? 'var(--fx-color-bg-card)' : 'transparent',
                  opacity: option.disabled ? 0.5 : 1,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
