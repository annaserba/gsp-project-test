import { z } from 'zod';

import { dashboardMock } from '../data/dashboardMock';
import type { DashboardPayload, DashboardQuery, DashboardSortBy, DistributionBlock, EfficiencyRow, EfficiencyTableBlock, SummaryCardModel } from '../types/dashboard';

const summaryCardSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.enum(['people', 'percent', 'currency']),
  helperText: z.string().optional(),
  tone: z.enum(['neutral', 'positive', 'warning', 'critical']).optional(),
});

const distributionBlockSchema = z.object({
  title: z.string(),
  leftMetricTitle: z.string(),
  rightMetricTitle: z.string(),
  legend: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      color: z.string(),
    }),
  ),
  rows: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      staffedValue: z.number(),
      staffedPercent: z.number(),
      compositionPercent: z.number(),
      segments: z.record(z.string(), z.number()),
    }),
  ),
});

const efficiencyTableSchema = z.object({
  title: z.string(),
  columns: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      type: z.enum(['text', 'number', 'percent']),
      fullLabel: z.string().optional(),
    }),
  ),
  rows: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kpiV2: z.number(),
      kpiV3: z.number(),
      limit: z.number(),
      onSite: z.number(),
      ratioToKpi: z.number(),
      ratioToChangedKpi: z.number(),
      ratioToLimits: z.number(),
      status: z.enum(['neutral', 'positive', 'warning', 'critical']),
    }),
  ),
});

const dashboardSchema = z.object({
  meta: z.object({
    title: z.string(),
    reportDate: z.string(),
    generatedAt: z.string(),
    viewer: z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
    }),
  }),
  filters: z.object({
    date: z.object({
      value: z.string(),
      min: z.string().optional(),
      max: z.string().optional(),
    }),
    groupBy: z.object({
      value: z.enum(['all', 'company', 'project']),
      options: z.array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      ),
    }),
    activeCount: z.number().optional(),
  }),
  summaryCards: z.array(summaryCardSchema),
  companyDistribution: distributionBlockSchema,
  projectDistribution: distributionBlockSchema,
  companyEfficiency: efficiencyTableSchema,
  projectEfficiency: efficiencyTableSchema,
});

export const dashboardAdapter = {
  async getDashboardData(query: DashboardQuery = {}): Promise<DashboardPayload> {
    const parsed = dashboardSchema.parse(structuredClone(dashboardMock));
    const reportDate = query.reportDate ?? parsed.filters.date.value;
    const groupBy = query.groupBy ?? parsed.filters.groupBy.value;
    const sortBy = query.sortBy ?? 'default';
    const scenario = getScenarioMultiplier(reportDate);
    const adjusted = applyScenario(parsed, scenario, reportDate, groupBy, sortBy);

    return new Promise((resolve) => {
      setTimeout(() => resolve(adjusted), 250);
    });
  },
};

function applyScenario(
  payload: DashboardPayload,
  multiplier: number,
  reportDate: string,
  groupBy: DashboardQuery['groupBy'],
  sortBy: DashboardSortBy,
): DashboardPayload {
  payload.meta.reportDate = reportDate;
  payload.filters.date.value = reportDate;
  payload.filters.groupBy.value = groupBy ?? 'all';
  payload.filters.activeCount = 1 + ((groupBy ?? 'all') === 'all' ? 0 : 1) + (sortBy === 'default' ? 0 : 1);
  payload.summaryCards = payload.summaryCards.map((card) => scaleSummaryCard(card, multiplier));
  payload.companyDistribution = sortDistributionBlock(scaleDistributionBlock(payload.companyDistribution, multiplier), sortBy);
  payload.projectDistribution = sortDistributionBlock(scaleDistributionBlock(payload.projectDistribution, multiplier), sortBy);
  payload.companyEfficiency = sortEfficiencyTable(scaleEfficiencyTable(payload.companyEfficiency, multiplier), sortBy);
  payload.projectEfficiency = sortEfficiencyTable(scaleEfficiencyTable(payload.projectEfficiency, multiplier), sortBy);

  return payload;
}

function scaleSummaryCard(card: SummaryCardModel, multiplier: number): SummaryCardModel {
  if (card.unit === 'percent') {
    return {
      ...card,
      value: clampPercent(Math.round(card.value * (0.98 + (multiplier - 1) * 0.6))),
    };
  }

  return {
    ...card,
    value: Math.round(card.value * multiplier),
  };
}

function scaleDistributionBlock(block: DistributionBlock, multiplier: number): DistributionBlock {
  return {
    ...block,
    rows: block.rows.map((row) => ({
      ...row,
      staffedValue: Math.round(row.staffedValue * multiplier),
      staffedPercent: clampPercent(Math.round(row.staffedPercent * (0.98 + (multiplier - 1) * 0.85))),
      compositionPercent: clampPercent(Math.round(row.compositionPercent * (0.96 + (multiplier - 1) * 0.55))),
    })),
  };
}

function scaleEfficiencyTable(block: EfficiencyTableBlock, multiplier: number): EfficiencyTableBlock {
  return {
    ...block,
    rows: block.rows.map((row) => ({
      ...row,
      kpiV2: Math.round(row.kpiV2 * multiplier),
      kpiV3: Math.round(row.kpiV3 * multiplier),
      limit: Math.round(row.limit * multiplier),
      onSite: Math.round(row.onSite * multiplier),
      ratioToKpi: clampPercent(Math.round(row.ratioToKpi * (0.98 + (multiplier - 1) * 0.9))),
      ratioToChangedKpi: clampPercent(Math.round(row.ratioToChangedKpi * (0.98 + (multiplier - 1) * 0.8))),
      ratioToLimits: clampPercent(Math.round(row.ratioToLimits * (0.98 + (multiplier - 1) * 0.85))),
    })),
  };
}

function sortDistributionBlock(block: DistributionBlock, sortBy: DashboardSortBy): DistributionBlock {
  const rows = [...block.rows];

  if (sortBy === 'staffed') {
    rows.sort((left, right) => right.staffedValue - left.staffedValue);
  } else if (sortBy === 'coverage') {
    rows.sort((left, right) => right.staffedPercent - left.staffedPercent);
  }

  return {
    ...block,
    rows,
  };
}

function sortEfficiencyTable(block: EfficiencyTableBlock, sortBy: DashboardSortBy): EfficiencyTableBlock {
  const rows = [...block.rows];

  if (sortBy === 'staffed') {
    rows.sort((left, right) => compareEfficiencyRows(left, right, 'onSite'));
  } else if (sortBy === 'coverage') {
    rows.sort((left, right) => compareEfficiencyRows(left, right, 'ratioToKpi'));
  }

  return {
    ...block,
    rows,
  };
}

function compareEfficiencyRows(left: EfficiencyRow, right: EfficiencyRow, key: 'onSite' | 'ratioToKpi') {
  return right[key] - left[key];
}

function getScenarioMultiplier(reportDate: string) {
  const scenarios: Record<string, number> = {
    '2024-01-01': 0.93,
    '2024-02-01': 0.97,
    '2024-03-01': 1,
    '2024-04-01': 1.04,
    '2024-05-01': 1.08,
  };

  return scenarios[reportDate] ?? 1;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(value, 199));
}
