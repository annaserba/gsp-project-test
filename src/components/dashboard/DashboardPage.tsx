import { useEffect, useRef, useState, useTransition } from 'react';
import { ChevronDown } from 'lucide-react';

import { dashboardAdapter } from '../../services/dashboardAdapter';
import type { DashboardGroupBy, DashboardPayload, DashboardSortBy } from '../../types/dashboard';
import { DashboardContent } from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { ErrorState, LoadingState } from './StateCard';
import type { LoadState } from './types';
import './DashboardPage.scss';
import './DashboardControls.scss';

export function DashboardPage() {
  const [state, setState] = useState<LoadState>('loading');
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [reportDate, setReportDate] = useState(() => getInitialReportDate());
  const [groupBy, setGroupBy] = useState<DashboardGroupBy>(() => getInitialGroupBy());
  const [sortBy, setSortBy] = useState<DashboardSortBy>(() => getInitialSortBy());
  const [isRefreshing, startTransition] = useTransition();
  const [selectedCompanyRowId, setSelectedCompanyRowId] = useState<string>('');
  const [selectedProjectRowId, setSelectedProjectRowId] = useState<string>('');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedCompanyRowId('');
        setSelectedProjectRowId('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const isInitialLoad = !hasLoadedRef.current;

    void dashboardAdapter
      .getDashboardData({ reportDate, groupBy, sortBy })
      .then((payload) => {
        if (!active) {
          return;
        }

        if (isInitialLoad) {
          setDashboard(payload);
          setState('ready');
          hasLoadedRef.current = true;
        } else {
          startTransition(() => {
            setDashboard(payload);
            setState('ready');
          });
        }
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setState('error');
      });

    return () => {
      active = false;
    };
  }, [groupBy, reportDate, sortBy]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const search = new URLSearchParams(window.location.search);
    search.set('date', reportDate);
    search.set('groupBy', groupBy);
    search.set('sortBy', sortBy);
    const nextUrl = `${window.location.pathname}?${search.toString()}`;
    window.history.replaceState(null, '', nextUrl);
  }, [groupBy, reportDate, sortBy]);

  return (
    <div className="page-shell">
      <header className="top-strip">
        <span className="top-strip__user">
          {dashboard?.meta.viewer.name ?? 'Загрузка профиля'}
          <ChevronDown size={16} />
        </span>
      </header>

      <main className="dashboard-frame">
        <DashboardHeader
          dashboard={dashboard}
          reportDate={reportDate}
          groupBy={groupBy}
          sortBy={sortBy}
          isRefreshing={isRefreshing}
          onReportDateChange={setReportDate}
          onGroupByChange={setGroupBy}
          onSortByChange={setSortBy}
        />

        {state === 'loading' ? <LoadingState /> : null}
        {state === 'error' ? <ErrorState /> : null}

        {state === 'ready' && dashboard ? (
          <DashboardContent
            dashboard={dashboard}
            groupBy={groupBy}
            selectedCompanyRowId={selectedCompanyRowId}
            selectedProjectRowId={selectedProjectRowId}
            onCompanyRowSelect={setSelectedCompanyRowId}
            onProjectRowSelect={setSelectedProjectRowId}
          />
        ) : null}
      </main>
    </div>
  );
}

function getInitialReportDate() {
  if (typeof window === 'undefined') {
    return '2024-03-01';
  }

  const date = new URLSearchParams(window.location.search).get('date');

  return isValidDateValue(date) ? date : '2024-03-01';
}

function getInitialGroupBy(): DashboardGroupBy {
  if (typeof window === 'undefined') {
    return 'all';
  }

  const groupBy = new URLSearchParams(window.location.search).get('groupBy');

  return isDashboardGroupBy(groupBy) ? groupBy : 'all';
}

function getInitialSortBy(): DashboardSortBy {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const sortBy = new URLSearchParams(window.location.search).get('sortBy');

  return isDashboardSortBy(sortBy) ? sortBy : 'default';
}

function isDashboardGroupBy(value: string | null): value is DashboardGroupBy {
  return value === 'all' || value === 'company' || value === 'project';
}

function isDashboardSortBy(value: string | null): value is DashboardSortBy {
  return value === 'default' || value === 'staffed' || value === 'coverage';
}

function isValidDateValue(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}
