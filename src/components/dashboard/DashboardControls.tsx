import { Filter, Shuffle } from 'lucide-react';

import { formatDate } from '../../lib/format';
import type { DashboardGroupBy, DashboardPayload, DashboardSortBy } from '../../types/dashboard';
import { Popover } from './Popover';

interface DashboardControlsProps {
  dashboard: DashboardPayload;
  reportDate: string;
  groupBy: DashboardGroupBy;
  sortBy: DashboardSortBy;
  isRefreshing: boolean;
  onReportDateChange: (date: string) => void;
  onGroupByChange: (groupBy: DashboardGroupBy) => void;
  onSortByChange: (sortBy: DashboardSortBy) => void;
}

const SORT_OPTIONS: Array<{ value: DashboardSortBy; label: string }> = [
  { value: 'default', label: 'По порядку макета' },
  { value: 'staffed', label: 'По численности на объекте' },
  { value: 'coverage', label: 'По проценту укомплектованности' },
];

export function DashboardControls({
  dashboard,
  reportDate,
  groupBy,
  sortBy,
  isRefreshing,
  onReportDateChange,
  onGroupByChange,
  onSortByChange,
}: DashboardControlsProps) {
  return (
    <div className="dashboard-controls">
      <div className="control-chip-wrapper">
        <span className="control-chip__label">Дата отчета</span>
        <label className="control-chip">
          <input
            className="control-chip__input"
            type="date"
            value={reportDate}
            min={dashboard.filters.date.min}
            max={dashboard.filters.date.max}
            onChange={(event) => onReportDateChange(event.target.value)}
          />
        </label>
      </div>

      <Popover
        className="filter-cluster"
        panelClassName="popover__panel popover__panel--filters"
        trigger={(triggerProps) => (
          <>
            <button
              ref={triggerProps.ref}
              className="filter-cluster__main"
              type="button"
              aria-label="Открыть фильтры"
              aria-expanded={triggerProps['aria-expanded']}
              aria-controls={triggerProps['aria-controls']}
              onClick={triggerProps.onClick}
            >
              <Filter size={16} />
              <span>Фильтры</span>
              <strong>{dashboard.filters.activeCount ?? 0}</strong>
            </button>

            <button
              className="filter-cluster__action"
              type="button"
              aria-label="Перемешать"
              onClick={triggerProps.onClick}
            >
              <Shuffle size={18} />
            </button>
          </>
        )}
      >
        <div className="filter-panel">
          <div className="filter-panel__section">
            <strong>Показывать</strong>
            <div className="filter-panel__options">
              {dashboard.filters.groupBy.options.map((option) => (
                <label key={option.value} className="filter-option">
                  <input
                    type="radio"
                    name="groupBy"
                    value={option.value}
                    checked={groupBy === option.value}
                    onChange={() => onGroupByChange(option.value as DashboardGroupBy)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-panel__section">
            <strong>Сортировка</strong>
            <div className="filter-panel__options">
              {SORT_OPTIONS.map((option) => (
                <label key={option.value} className="filter-option">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={() => onSortByChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <p className="filter-panel__meta">
            {isRefreshing ? 'Обновление данных...' : `Дата отчета: ${formatDate(dashboard.meta.reportDate)}`}
          </p>
        </div>
      </Popover>
    </div>
  );
}
