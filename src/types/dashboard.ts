export type MetricUnit = 'people' | 'percent' | 'currency';
export type MetricTone = 'neutral' | 'positive' | 'warning' | 'critical';
export type DashboardGroupBy = 'all' | 'company' | 'project';
export type DashboardSortBy = 'default' | 'staffed' | 'coverage';

export type DashboardPayload = {
  meta: DashboardMeta;
  filters: DashboardFilters;
  summaryCards: SummaryCardModel[];
  companyDistribution: DistributionBlock;
  projectDistribution: DistributionBlock;
  companyEfficiency: EfficiencyTableBlock;
  projectEfficiency: EfficiencyTableBlock;
};

export type DashboardMeta = {
  title: string;
  reportDate: string;
  generatedAt: string;
  viewer: {
    id: string;
    name: string;
    role: string;
  };
};

export type DashboardFilters = {
  date: {
    value: string;
    min?: string;
    max?: string;
  };
  groupBy: {
    value: DashboardGroupBy;
    options: Array<{ value: string; label: string }>;
  };
  activeCount?: number;
};

export type DashboardQuery = {
  reportDate?: string;
  groupBy?: DashboardGroupBy;
  sortBy?: DashboardSortBy;
};

export type SummaryCardModel = {
  id: string;
  label: string;
  value: number;
  unit: MetricUnit;
  helperText?: string;
  tone?: MetricTone;
};

export type LegendItem = {
  key: string;
  label: string;
  color: string;
};

export type DistributionRow = {
  id: string;
  label: string;
  staffedValue: number;
  staffedPercent: number;
  compositionPercent: number;
  segments: Record<string, number>;
};

export type DistributionBlock = {
  title: string;
  leftMetricTitle: string;
  rightMetricTitle: string;
  legend: LegendItem[];
  rows: DistributionRow[];
};

export type TableColumn = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'percent';
  fullLabel?: string;
};

export type EfficiencyRow = {
  id: string;
  name: string;
  kpiV2: number;
  kpiV3: number;
  limit: number;
  onSite: number;
  ratioToKpi: number;
  ratioToChangedKpi: number;
  ratioToLimits: number;
  status: MetricTone;
};

export type EfficiencyTableBlock = {
  title: string;
  columns: TableColumn[];
  rows: EfficiencyRow[];
};
