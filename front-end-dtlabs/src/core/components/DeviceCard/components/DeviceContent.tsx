import { Heartbeat } from '@/core/domain/entities/heartbeat';
import { AlertIndicator, CardContent, MetricGrid, MetricIcon, MetricInfo, MetricItem, MetricName, MetricSection, MetricValue, ProgressBar, ProgressFill } from '../styled';
import { MetricConfig } from '../types';

interface DeviceContentProps {
  metricsConfig: MetricConfig[];
  latestHeartbeat: Heartbeat;
  getProgressColor: (value: number, metricName: string, maxValue: number) => string;
  isMetricInAlert: (metricName: string, currentValue: number) => boolean;
}

const DeviceContent = ({metricsConfig, latestHeartbeat, getProgressColor, isMetricInAlert}: DeviceContentProps) => {

  const calculateWidth = (value: number, maxValue: number, key: string): number => {
    if (key === 'connectivity') {
      return value === 1 ? 100 : 0;
    }
    return Math.min((value / maxValue) * 100, 100);
  };

  const formatValue = (value: number, unit: string, key: string): string => {
    if (key === 'connectivity') {
      return value === 1 ? 'Conectado' : 'Desconectado';
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <CardContent>
      <MetricGrid>
        {metricsConfig.map((metric) => {
          const value = latestHeartbeat[metric.key as keyof typeof latestHeartbeat] as number;
          const width = calculateWidth(value, metric.maxValue, metric.key);
          const color = getProgressColor(value, metric.key, metric.maxValue);
          const displayValue = formatValue(value, metric.unit, metric.key);
          const showProgress = metric.key !== 'connectivity';

          return (
            <MetricSection key={metric.key}>
              <MetricItem>
                <MetricIcon>{metric.icon}</MetricIcon>
                <MetricInfo>
                  <MetricName>{metric.label}</MetricName>
                  <MetricValue>{displayValue}</MetricValue>
                  {showProgress && (
                    <ProgressBar>
                      <ProgressFill width={width} color={color} />
                    </ProgressBar>
                  )}
                </MetricInfo>
                {isMetricInAlert(metric.key, value) && (
                  <AlertIndicator style={{ marginRight: '8px'}} small>⚠️</AlertIndicator>
                )}
              </MetricItem>
            </MetricSection>
          );
        })}
      </MetricGrid>
    </CardContent>
  );
}

export default DeviceContent;


