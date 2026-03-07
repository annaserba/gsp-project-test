import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import type { MetricUnit } from '../types/dashboard';

dayjs.locale('ru');

const integerFormatter = new Intl.NumberFormat('ru-RU');

export function formatDate(value: string) {
  return dayjs(value).format('DD.MM.YYYY');
}

export function formatMetricValue(value: number, unit: MetricUnit) {
  if (unit === 'percent') {
    return `${value}%`;
  }

  if (unit === 'currency') {
    return `${integerFormatter.format(value)} RUB`;
  }

  return integerFormatter.format(value);
}

export function formatPercent(value: number) {
  return `${value}%`;
}
