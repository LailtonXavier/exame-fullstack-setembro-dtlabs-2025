import { Device } from '@/core/domain/entities/device';
import { Heartbeat } from '@/core/domain/entities/heartbeat';

export interface DeviceCardProps {
  device: Device;
}

export interface ProgressFillProps {
  width: number;
  color: string;
}

export interface CardContainerProps {
  hasAlerts: boolean;
}

export interface StatusBadgeProps {
  isOnline: boolean;
}

export interface AlertIndicatorProps {
  small?: boolean;
}

export interface MetricConfig {
  key: keyof Omit<Heartbeat, 'id' | 'deviceId' | 'bootTime' | 'createdAt'>;
  label: string;
  icon: string;
  unit: string;
  maxValue: number;
}