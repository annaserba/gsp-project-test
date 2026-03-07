import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

type PopoverProps = {
  trigger: (props: {
    ref: React.RefObject<HTMLButtonElement | null>;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  }) => ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  mode?: 'click' | 'hover';
};

export function Popover({
  trigger,
  children,
  className,
  panelClassName,
  mode = 'click',
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open || mode !== 'click') {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mode, open]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  function openHover() {
    if (mode === 'hover') {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }

      setOpen(true);
    }
  }

  function closeHover() {
    if (mode === 'hover') {
      hoverTimeoutRef.current = window.setTimeout(() => {
        setOpen(false);
      }, 120);
    }
  }

  return (
    <div
      ref={containerRef}
      className={className ?? 'popover'}
      onMouseEnter={openHover}
      onMouseLeave={closeHover}
    >
      {trigger({
        ref: triggerRef,
        onClick: () => {
          if (mode === 'click') {
            setOpen((value) => !value);
          }
        },
        onMouseEnter: openHover,
        onMouseLeave: closeHover,
        onFocus: openHover,
        onBlur: closeHover,
        'aria-expanded': open,
        'aria-controls': panelId,
      })}

      {open ? (
        <div id={panelId} className={panelClassName ?? 'popover__panel'} role="dialog">
          {children}
        </div>
      ) : null}
    </div>
  );
}
