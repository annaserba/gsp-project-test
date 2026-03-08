import { formatMetricValue, formatPercent } from '../../lib/format';
import type { EfficiencyRow, EfficiencyTableBlock } from '../../types/dashboard';
import { Popover } from './Popover';
import './EfficiencyTablePanel.scss';

export function EfficiencyTablePanel({ 
  block,
  selectedRowId,
  onRowSelect,
}: { 
  block: EfficiencyTableBlock;
  selectedRowId?: string;
  onRowSelect?: (rowId: string) => void;
}) {
  return (
    <section className="analytics-panel analytics-panel--table">
      <header className="analytics-panel__header analytics-panel__header--compact">
        <h2>{block.title}</h2>
      </header>

      <div className="table-wrap">
        <table className="efficiency-table">
          <thead>
            <tr>
              {block.columns.map((column, index) => (
                <TableHeader key={column.key} column={column} isFirst={index === 0} />
              ))}
            </tr>
          </thead>

          <tbody>
            {block.rows.map((row) => {
              const isSelected = selectedRowId === row.id;
              const isMuted = !!(selectedRowId && !isSelected);
              const className = isSelected 
                ? 'efficiency-table__row--selected' 
                : isMuted 
                  ? 'efficiency-table__row--muted' 
                  : '';
              
              return (
                <tr 
                  key={row.id}
                  className={className}
                  onClick={() => onRowSelect?.(row.id)}
                >
                <th scope="row" className="efficiency-table__name-cell">
                  {row.name}
                </th>
                <DataCell value={row.kpiV2} unit="people" tooltip={block.columns[1]?.fullLabel} isMuted={isMuted} />
                <DataCell value={row.kpiV3} unit="people" tooltip={block.columns[2]?.fullLabel} isMuted={isMuted} />
                <DataCell value={row.limit} unit="people" tooltip={block.columns[3]?.fullLabel} isMuted={isMuted} />
                <DataCell value={row.onSite} unit="people" tooltip={block.columns[4]?.fullLabel} isMuted={isMuted} />
                <StatusCell row={row} field="ratioToKpi" tooltip={block.columns[5]?.fullLabel} isMuted={isMuted} />
                <StatusCell row={row} field="ratioToChangedKpi" tooltip={block.columns[6]?.fullLabel} isMuted={isMuted} />
                <StatusCell row={row} field="ratioToLimits" tooltip={block.columns[7]?.fullLabel} isMuted={isMuted} />
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableHeader({ column, isFirst }: { column: EfficiencyTableBlock['columns'][number]; isFirst: boolean }) {
  const hasTooltip = column.fullLabel && column.fullLabel !== column.label;

  if (!hasTooltip) {
    return (
      <th className={isFirst ? 'efficiency-table__name-head' : undefined}>
        {column.label}
      </th>
    );
  }

  return (
    <th className={`${isFirst ? 'efficiency-table__name-head' : ''} table-header-with-tooltip`}>
      <Popover
        className="table-header-popover"
        panelClassName="popover__panel popover__panel--tooltip popover__panel--dark"
        mode="hover"
        trigger={(triggerProps) => (
          <span
            ref={triggerProps.ref}
            className="table-header-background"
            onMouseEnter={triggerProps.onMouseEnter}
            onMouseLeave={triggerProps.onMouseLeave}
            onFocus={triggerProps.onFocus}
            onBlur={triggerProps.onBlur}
          >
            <span className="table-header-text">{column.label}</span>
          </span>
        )}
      >
        <div className="tooltip-card tooltip-card--dark">
          {column.fullLabel}
        </div>
      </Popover>
    </th>
  );
}

function DataCell({ value, unit, tooltip, isMuted }: { value: number; unit: 'people'; tooltip?: string; isMuted?: boolean }) {
  const formattedValue = formatMetricValue(value, unit);
  const showTooltip = tooltip && !isMuted;

  if (!showTooltip) {
    return <td>{formattedValue}</td>;
  }

  return (
    <td>
      <Popover
        className="data-cell-popover"
        panelClassName="popover__panel popover__panel--tooltip popover__panel--dark"
        mode="hover"
        trigger={(triggerProps) => (
          <span
            ref={triggerProps.ref}
            className="data-cell-background"
            onMouseEnter={triggerProps.onMouseEnter}
            onMouseLeave={triggerProps.onMouseLeave}
            onFocus={triggerProps.onFocus}
            onBlur={triggerProps.onBlur}
          >
            {formattedValue}
          </span>
        )}
      >
        <div className="tooltip-card tooltip-card--dark">
          {tooltip}
        </div>
      </Popover>
    </td>
  );
}

function getStatusByValue(value: number): 'positive' | 'warning' | 'critical' | 'neutral' {
  if (value > 100) return 'positive';
  if (value < 60) return 'critical';
  return 'warning';
}

function StatusCell({
  row,
  field,
  tooltip,
  isMuted,
}: {
  row: EfficiencyRow;
  field: 'ratioToKpi' | 'ratioToChangedKpi' | 'ratioToLimits';
  tooltip?: string;
  isMuted?: boolean;
}) {
  const value = row[field];
  const status = getStatusByValue(value);
  const formattedValue = formatPercent(value);
  const showTooltip = tooltip && !isMuted;

  if (!showTooltip) {
    return <td className={`status-cell status-cell--${status}`}>{formattedValue}</td>;
  }

  return (
    <td className={`status-cell status-cell--${status}`}>
      <Popover
        className="data-cell-popover"
        panelClassName="popover__panel popover__panel--tooltip popover__panel--dark"
        mode="hover"
        trigger={(triggerProps) => (
          <span
            ref={triggerProps.ref}
            className="data-cell-background"
            onMouseEnter={triggerProps.onMouseEnter}
            onMouseLeave={triggerProps.onMouseLeave}
            onFocus={triggerProps.onFocus}
            onBlur={triggerProps.onBlur}
          >
            {formattedValue}
          </span>
        )}
      >
        <div className="tooltip-card tooltip-card--dark">
          {tooltip}
        </div>
      </Popover>
    </td>
  );
}
