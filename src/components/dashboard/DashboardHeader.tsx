import { ChevronLeft } from 'lucide-react';

import type { DashboardGroupBy, DashboardPayload, DashboardSortBy } from '../../types/dashboard';
import { DashboardControls } from './DashboardControls';

interface DashboardHeaderProps {
  dashboard: DashboardPayload | null;
  reportDate: string;
  groupBy: DashboardGroupBy;
  sortBy: DashboardSortBy;
  isRefreshing: boolean;
  onReportDateChange: (date: string) => void;
  onGroupByChange: (groupBy: DashboardGroupBy) => void;
  onSortByChange: (sortBy: DashboardSortBy) => void;
}

export function DashboardHeader({
  dashboard,
  reportDate,
  groupBy,
  sortBy,
  isRefreshing,
  onReportDateChange,
  onGroupByChange,
  onSortByChange,
}: DashboardHeaderProps) {
  return (
    <section className="dashboard-header">
      <div className="dashboard-heading">
        <button className="icon-button" type="button" aria-label="Назад">
          <ChevronLeft size={18} />
        </button>

        <div>
          <h1>{dashboard?.meta.title ?? 'Дашборд'}</h1>
        </div>
      </div>

      {dashboard ? (
        <DashboardControls
          dashboard={dashboard}
          reportDate={reportDate}
          groupBy={groupBy}
          sortBy={sortBy}
          isRefreshing={isRefreshing}
          onReportDateChange={onReportDateChange}
          onGroupByChange={onGroupByChange}
          onSortByChange={onSortByChange}
        />
      ) : null}
    </section>
  );
}
