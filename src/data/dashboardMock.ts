import type { DashboardPayload } from '../types/dashboard';

const legend = [
  { key: 'intershiftRest', label: 'Межвахта', color: '#7db7ff' },
  { key: 'atFacilityNotWorking', label: 'На объекте, но...', color: '#68c7b8' },
  { key: 'inTransit', label: 'В пути', color: '#f4c86a' },
  { key: 'outsourced', label: 'Передан на аутсорс', color: '#d29b63' },
  { key: 'other', label: 'Прочее', color: '#b7b7b7' },
] as const;

const tableColumns = [
  { key: 'name', label: '', type: 'text' as const },
  { key: 'kpiV2', label: 'КП-версия 2', type: 'number' as const, fullLabel: 'Контрольный показатель, версия 2' },
  { key: 'kpiV3', label: 'КП-версия 3', type: 'number' as const, fullLabel: 'Контрольный показатель, версия 3' },
  { key: 'limit', label: 'Лимиты', type: 'number' as const },
  { key: 'onSite', label: 'На объекте', type: 'number' as const },
  { key: 'ratioToKpi', label: 'На объекте / КП', type: 'percent' as const, fullLabel: 'На объекте к контрольному показателю' },
  {
    key: 'ratioToChangedKpi',
    label: 'На объекте / Изм. КП',
    type: 'percent' as const,
    fullLabel: 'На объекте к измененному контрольному показателю',
  },
  { key: 'ratioToLimits', label: 'На объекте / Лимиты', type: 'percent' as const },
] as const;

export const dashboardMock: DashboardPayload = {
  meta: {
    title: 'Название',
    reportDate: '2024-03-01',
    generatedAt: '2026-03-08T19:30:00+03:00',
    viewer: {
      id: 'evgeny-soloviev',
      name: 'Евгений Соловьев',
      role: 'manager',
    },
  },
  filters: {
    date: {
      value: '2024-03-01',
      min: '2024-01-01',
      max: '2024-12-31',
    },
    groupBy: {
      value: 'all',
      options: [
        { value: 'all', label: 'Все' },
        { value: 'company', label: 'По компаниям' },
        { value: 'project', label: 'По проектам' },
      ],
    },
    activeCount: 1,
  },
  summaryCards: [
    { id: 'onSite', label: 'На объекте', value: 8500, unit: 'people', helperText: '80% укомплектованность', tone: 'warning' },
    { id: 'deficit', label: 'Дефицит', value: 3500, unit: 'people', helperText: '20% от потребности', tone: 'warning' },
    { id: 'required', label: 'Потребность', value: 12000, unit: 'people', tone: 'neutral' },
    { id: 'limits', label: 'Лимиты', value: 11000, unit: 'people', helperText: '92% от потребности', tone: 'warning' },
    { id: 'attendanceRate', label: 'Коэффициент явки', value: 52, unit: 'percent', helperText: '99% явки от числ. на объекте', tone: 'positive' },
    { id: 'notAssigned', label: 'Не задейств. в производстве', value: 15000, unit: 'people', tone: 'neutral' },
    { id: 'listedHeadcount', label: 'Списочная численленность', value: 30000, unit: 'people', helperText: 'Общая численность по списку', tone: 'neutral' },
  ],
  companyDistribution: {
    title: 'По компаниям, чел.',
    leftMetricTitle: 'На объекте',
    rightMetricTitle: 'Не задейств. в производстве',
    legend: [...legend],
    rows: [
      {
        id: 'gsp-1',
        label: 'ГСП-1',
        staffedValue: 5500,
        staffedPercent: 85,
        compositionPercent: 47,
        segments: { intershiftRest: 18, atFacilityNotWorking: 26, inTransit: 18, outsourced: 15, other: 23 },
      },
      {
        id: 'gsp-2',
        label: 'ГСП-2',
        staffedValue: 5000,
        staffedPercent: 90,
        compositionPercent: 42,
        segments: { intershiftRest: 12, atFacilityNotWorking: 30, inTransit: 19, outsourced: 18, other: 21 },
      },
      {
        id: 'gsp-4',
        label: 'ГСП-4',
        staffedValue: 4700,
        staffedPercent: 75,
        compositionPercent: 21,
        segments: { intershiftRest: 27, atFacilityNotWorking: 16, inTransit: 25, outsourced: 14, other: 18 },
      },
      {
        id: 'gsp-5',
        label: 'ГСП-5',
        staffedValue: 4500,
        staffedPercent: 92,
        compositionPercent: 68,
        segments: { intershiftRest: 17, atFacilityNotWorking: 31, inTransit: 11, outsourced: 14, other: 27 },
      },
      {
        id: 'gsp-7',
        label: 'ГСП-7',
        staffedValue: 4000,
        staffedPercent: 105,
        compositionPercent: 21,
        segments: { intershiftRest: 29, atFacilityNotWorking: 16, inTransit: 18, outsourced: 8, other: 29 },
      },
    ],
  },
  projectDistribution: {
    title: 'По проектам, чел.',
    leftMetricTitle: 'На объекте',
    rightMetricTitle: 'Вне объекта',
    legend: [...legend],
    rows: [
      {
        id: '09-01',
        label: '09/01',
        staffedValue: 4000,
        staffedPercent: 105,
        compositionPercent: 21,
        segments: { intershiftRest: 23, atFacilityNotWorking: 9, inTransit: 12, outsourced: 14, other: 42 },
      },
      {
        id: '100-1',
        label: '100/1',
        staffedValue: 5500,
        staffedPercent: 85,
        compositionPercent: 47,
        segments: { intershiftRest: 20, atFacilityNotWorking: 27, inTransit: 17, outsourced: 14, other: 22 },
      },
      {
        id: '199-9',
        label: '199/9',
        staffedValue: 4500,
        staffedPercent: 92,
        compositionPercent: 68,
        segments: { intershiftRest: 11, atFacilityNotWorking: 34, inTransit: 16, outsourced: 14, other: 25 },
      },
      {
        id: '222-3',
        label: '222/3',
        staffedValue: 4700,
        staffedPercent: 75,
        compositionPercent: 21,
        segments: { intershiftRest: 31, atFacilityNotWorking: 17, inTransit: 17, outsourced: 15, other: 20 },
      },
      {
        id: '352-5',
        label: '352/5',
        staffedValue: 5000,
        staffedPercent: 90,
        compositionPercent: 42,
        segments: { intershiftRest: 18, atFacilityNotWorking: 27, inTransit: 17, outsourced: 16, other: 22 },
      },
    ],
  },
  companyEfficiency: {
    title: 'План-факт анализ явочной численности по компаниям, чел.',
    columns: [...tableColumns],
    rows: [
      { id: 'gsp-1', name: 'ГСП-1', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 95, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'neutral' },
      { id: 'gsp-2', name: 'ГСП-2', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 95, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'warning' },
      { id: 'gsp-4', name: 'ГСП-4', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 51, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'critical' },
      { id: 'gsp-5', name: 'ГСП-5', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 171, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'positive' },
      { id: 'gsp-7', name: 'ГСП-7', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 51, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'critical' },
    ],
  },
  projectEfficiency: {
    title: 'План-факт анализ явочной численности по проектам, чел.',
    columns: [...tableColumns],
    rows: [
      { id: '09-01', name: '09/01', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 51, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'critical' },
      { id: '100-1', name: '100/1', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 95, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'warning' },
      { id: '199-9', name: '199/9', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 9000, ratioToKpi: 101, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'positive' },
      { id: '222-3', name: '222/3', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 95, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'warning' },
      { id: '352-5', name: '352/5', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 95, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'warning' },
      { id: '1212-1', name: '1212/1', kpiV2: 10000, kpiV3: 9000, limit: 8500, onSite: 8000, ratioToKpi: 51, ratioToChangedKpi: 85, ratioToLimits: 80, status: 'critical' },
    ],
  },
};
