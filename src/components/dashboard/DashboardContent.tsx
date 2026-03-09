import type { DashboardGroupBy, DashboardPayload } from '../../types/dashboard';
import { DistributionPanel } from './DistributionPanel';
import { EfficiencyTablePanel } from './EfficiencyTablePanel';
import { SummaryCard } from './SummaryCard';

interface DashboardContentProps {
  dashboard: DashboardPayload;
  groupBy: DashboardGroupBy;
  selectedCompanyRowId: string;
  selectedProjectRowId: string;
  onCompanyRowSelect: (id: string) => void;
  onProjectRowSelect: (id: string) => void;
}

export function DashboardContent({
  dashboard,
  groupBy,
  selectedCompanyRowId,
  selectedProjectRowId,
  onCompanyRowSelect,
  onProjectRowSelect,
}: DashboardContentProps) {
  return (
    <>
      <section className="summary-grid" aria-label="Сводные показатели">
        {dashboard.summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <section className="dashboard-body">
        {(groupBy === 'all' || groupBy === 'company') && (
          <>
            <DistributionPanel
              block={dashboard.companyDistribution}
              selectionMode="single"
              selectedRowId={selectedCompanyRowId}
              onRowSelect={onCompanyRowSelect}
            />

            <EfficiencyTablePanel 
              block={dashboard.companyEfficiency}
              selectedRowId={selectedCompanyRowId}
              onRowSelect={onCompanyRowSelect}
            />
          </>
        )}

        {(groupBy === 'all' || groupBy === 'project') && (
          <>
            <DistributionPanel
              block={dashboard.projectDistribution}
              selectionMode="single"
              selectedRowId={selectedProjectRowId}
              onRowSelect={onProjectRowSelect}
            />

            <EfficiencyTablePanel 
              block={dashboard.projectEfficiency}
              selectedRowId={selectedProjectRowId}
              onRowSelect={onProjectRowSelect}
            />
          </>
        )}
      </section>
    </>
  );
}
