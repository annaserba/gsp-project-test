import { formatMetricValue, formatPercent } from '../../lib/format';
import type { DistributionBlock } from '../../types/dashboard';
import './DistributionPanel.scss';

type SelectionMode = 'single' | 'all';

export function DistributionPanel({
  block,
  selectionMode,
  selectedRowId,
  onRowSelect,
}: {
  block: DistributionBlock;
  selectionMode: SelectionMode;
  selectedRowId?: string;
  onRowSelect?: (rowId: string) => void;
}) {
  const maxCompositionPercent = Math.max(...block.rows.map((row) => row.compositionPercent), 1);
  const hasSelection = selectedRowId && selectedRowId !== '';

  return (
    <section className="analytics-panel analytics-panel--distribution">
      <header className="analytics-panel__header">
        <h2>{block.title}</h2>
        <div className="legend" aria-label="Легенда">
          {block.legend.map((item) => (
            <span key={item.key} className="legend__item">
              <i style={{ backgroundColor: getChartColor(item.key, item.color) }} />
              {item.label}
            </span>
          ))}
        </div>
      </header>

      <div className="distribution-grid">
        <div className="distribution-section distribution-section--comparison">
          <p className="distribution-section__label">{block.leftMetricTitle}</p>

          <div className="distribution-list distribution-list--comparison">
            {block.rows.map((row) => {
              const isSelected = row.id === selectedRowId;
              const isMuted = hasSelection && !isSelected;
              
              return (
                <button
                  key={`${block.title}-${row.id}-metric`}
                  className={`distribution-row distribution-row--button ${isMuted ? 'distribution-row--muted' : 'distribution-row--active'}`}
                  type="button"
                  onClick={() => {
                    if (selectionMode === 'single') {
                      onRowSelect?.(row.id);
                    }
                  }}
                >
                  <div className="distribution-row__head">
                    <span className="distribution-row__name">{row.label}</span>
                  </div>
                  <div className="distribution-row__metric" data-value={formatMetricValue(row.staffedValue, 'people')}>
                    <div className="metric-bar" >
                      <div
                        className={`metric-bar__fill metric-bar__fill--${getMetricTone(row.staffedPercent)}`}
                        style={{ width: `${Math.min(row.staffedPercent, 100)}%` }}
                      />
                      <span>{formatPercent(row.staffedPercent)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="distribution-section">
          <p className="distribution-section__label">{block.rightMetricTitle}</p>

          <div className="distribution-list distribution-list--comparison">
            {block.rows.map((row) => {
              const isSelected = row.id === selectedRowId;
              const isMuted = hasSelection && !isSelected;
              
              return (
                <button
                  key={`${block.title}-${row.id}-segments`}
                  className={`distribution-row distribution-row--button ${isMuted ? 'distribution-row--muted' : 'distribution-row--active'}`}
                  type="button"
                  onClick={() => {
                    if (selectionMode === 'single') {
                      onRowSelect?.(row.id);
                    }
                  }}
                >
                  <div className="distribution-row__head">
                    <span className="distribution-row__name">{row.label}</span>
                  </div>
                  <div className="distribution-row__metric" data-value={formatMetricValue(row.staffedValue, 'people')}>
                    <div className="stack-bar" aria-hidden="true" >
                      <svg className="stack-bar__svg" viewBox="0 0 100 20" preserveAspectRatio="none">
                      
                        {getStackSegments(row, block, maxCompositionPercent).map((segment) => (
                          <rect
                            key={segment.key}
                            x={segment.x}
                            y="1"
                            width={segment.width}
                            height="18"
                            rx="1.8"
                            fill={segment.color}
                          />
                        ))}
                      </svg>
                      <strong 
                        className="distribution-row__value" 
                        style={{ left: `${getCompositionWidth(row.compositionPercent, maxCompositionPercent)}%` }}
                      >
                        {formatPercent(row.compositionPercent)}
                      </strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function getCompositionWidth(totalPercent: number, maxPercent: number) {
  return Math.min(totalPercent / maxPercent, 1) * 100;
}

function getMetricTone(percent: number) {
  if (percent >= 100) {
    return 'positive';
  }

  if (percent >= 85) {
    return 'warning';
  }

  return 'critical';
}

function getChartColor(key: string, fallback: string) {
  const palette: Record<string, string> = {
    intershiftRest: '#7db7ff',
    atFacilityNotWorking: '#68c7b8',
    inTransit: '#f4c86a',
    outsourced: '#d29b63',
    other: '#b7b7b7',
  };

  return palette[key] ?? fallback;
}

function getStackSegments(row: DistributionBlock['rows'][number], block: DistributionBlock, maxCompositionPercent: number) {
  const totalWidth = getCompositionWidth(row.compositionPercent, maxCompositionPercent);
  const totalShare = block.legend.reduce((sum, item) => sum + Math.max(row.segments[item.key] ?? 0, 0), 0) || 1;
  const gap = 0.3; // отступ между сегментами
  let cursor = 0;

  return block.legend.map((item, index) => {
    const rawValue = Math.max(row.segments[item.key] ?? 0, 0);
    const width = (rawValue / totalShare) * totalWidth;
    const adjustedWidth = width > 0 ? Math.max(width - gap, 0) : 0;
    const segment = {
      key: item.key,
      x: cursor + (index > 0 ? gap : 0),
      width: adjustedWidth,
      color: getChartColor(item.key, item.color),
    };

    cursor += width;

    return segment;
  });
}

