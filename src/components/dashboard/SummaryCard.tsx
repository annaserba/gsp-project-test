import { Info } from 'lucide-react';

import { formatMetricValue } from '../../lib/format';
import type { SummaryCardModel } from '../../types/dashboard';
import { Popover } from './Popover';
import './SummaryCard.scss';

export function SummaryCard({ card }: { card: SummaryCardModel }) {
  const hintParts = splitHint(card.helperText);
  const useInfoIcon = (card.tone === 'warning' || card.tone === 'neutral') && card.id !== 'required';
  const showStatus = card.tone === 'critical';
  const valueToneClass = card.id === 'attendanceRate' ? `summary-card__value--${card.tone ?? 'neutral'}` : '';

  return (
    <article className="summary-card">
      <div className="summary-card__head">
        <span className="summary-card__label">{card.label}</span>

        {useInfoIcon ? (
          <Popover
            className="summary-card__info"
            panelClassName="popover__panel popover__panel--tooltip"
            mode="hover"
            trigger={(triggerProps) => (
              <button
                ref={triggerProps.ref}
                className={`summary-card__info-button summary-card__info-button--${card.tone ?? 'neutral'}`}
                type="button"
                aria-label={`Подсказка для показателя ${card.label}`}
                aria-expanded={triggerProps['aria-expanded']}
                aria-controls={triggerProps['aria-controls']}
                onClick={triggerProps.onClick}
                onMouseEnter={triggerProps.onMouseEnter}
                onMouseLeave={triggerProps.onMouseLeave}
                onFocus={triggerProps.onFocus}
                onBlur={triggerProps.onBlur}
              >
                <Info size={14} />
              </button>
            )}
          >
            <div className="tooltip-card">
              <strong>{card.label}</strong>
              <p>{card.helperText ?? 'Показатель требует пояснения.'}</p>
            </div>
          </Popover>
        ) : showStatus ? (
          <span className={`summary-card__status summary-card__status--${card.tone ?? 'neutral'}`} />
        ) : null}
      </div>

      <strong className={`summary-card__value ${valueToneClass}`.trim()}>{formatMetricValue(card.value, card.unit)}</strong>

      <p className="summary-card__hint">
        {hintParts.accent ? <span className={`summary-card__hint-accent summary-card__hint-accent--${card.tone ?? 'neutral'}`}>{hintParts.accent}</span> : null}
        <span>{hintParts.text}</span>
      </p>
    </article>
  );
}

function splitHint(value?: string) {
  if (!value) {
    return { accent: '', text: ' ' };
  }

  const match = value.match(/^(\d+%)(.*)$/u);

  if (!match) {
    return { accent: '', text: value };
  }

  return {
    accent: match[1],
    text: match[2].trimStart(),
  };
}
