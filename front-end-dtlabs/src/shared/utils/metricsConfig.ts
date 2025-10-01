import { MetricConfig } from '@/core/components/DeviceCard/types';

export const metricsConfig: MetricConfig[] = [
  {
    key: 'cpuUsage',
    label: 'CPU',
    icon: '💻',
    unit: '%',
    maxValue: 100
  },
  {
    key: 'ramUsage',
    label: 'RAM',
    icon: '🧠',
    unit: '%',
    maxValue: 100
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    icon: '🌡️',
    unit: '°C',
    maxValue: 100
  },
  {
    key: 'diskFree',
    label: 'Disco Livre',
    icon: '💾',
    unit: 'GB',
    maxValue: 200
  },
  {
    key: 'latencyDns',
    label: 'Lat DNS',
    icon: '📡',
    unit: 'ms',
    maxValue: 100
  },
  {
    key: 'connectivity',
    label: 'Conectividade',
    icon: '📶',
    unit: '',
    maxValue: 1
  }
];