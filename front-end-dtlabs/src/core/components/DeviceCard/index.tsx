import { metricsConfig } from '@/shared/utils/metricsConfig';
import React from 'react';
import DeviceContent from './components/DeviceContent';
import DeviceHeader from './components/DeviceHeader';
import HasHeartbeats from './components/hasHeartbeats';
import SeeMoreComponent from './components/SeeMore';
import {
  AlertIcon,
  CardContainer,
  CardFooter,
  HeartbeatInfo,
  LastUpdate,
  LocationInfo,
  Readings
} from './styled';
import { DeviceCardProps } from './types';
import { formatDate } from '@/shared/utils/formatDate';

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {

  const latestHeartbeat = device.heartbeats[device.heartbeats.length - 1];
  const hasHeartbeats = device.heartbeats.length > 0;

  const hasAlerts = device.notifications.length > 0;

const isOnline = hasHeartbeats && 
    new Date().getTime() - new Date(latestHeartbeat.createdAt).getTime() < 5 * 60 * 1000;

  const isMetricInAlert = (metricName: string, currentValue: number): boolean => {
    const metricNotifications = device.notifications.filter(
      (notif) => notif.metric === metricName
    );

    return metricNotifications.some((notif) => {
      switch (notif.condition) {
        case '>':
          return currentValue > notif.threshold;
        case '<':
          return currentValue < notif.threshold;
        case '>=':
          return currentValue >= notif.threshold;
        case '<=':
          return currentValue <= notif.threshold;
        case '==':
          return currentValue === notif.threshold;
        default:
          return false;
      }
    });
  };

  const getProgressColor = (value: number, metricName: string, maxValue: number): string => {
    const percentage = (value / maxValue) * 100;
    
    if (isMetricInAlert(metricName, value)) {
      return '#ef4444';
    }
    if (percentage > 80) return '#f59e0b';
    if (percentage > 60) return '#eab308';
    return '#22c55e';
  };

  const getBootTimeInfo = (): string => {
    if (!hasHeartbeats) return 'Nenhum dado disponível';
    
    const bootTime = new Date(latestHeartbeat.bootTime);
    const now = new Date();
    const uptimeMs = now.getTime() - bootTime.getTime();
    const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
    
    return `Ligado há ${uptimeHours}h (${formatDate(latestHeartbeat.bootTime)})`;
  };

  if (!hasHeartbeats) {
    return (
      <HasHeartbeats device={device}  isOnline={isOnline} description={device.description} hasAlerts={hasAlerts} location={device.location} name={device.name} sn={device.sn} />
    )
  }

  return (
    <CardContainer hasAlerts={hasAlerts}>
      <DeviceHeader device={device} description={device.description} hasAlerts={hasAlerts} isOnline={isOnline} name={device.name} />

      <LocationInfo>
        📍 {device.location} | SN: {device.sn}
      </LocationInfo>

      <HeartbeatInfo>
        ⏰ {getBootTimeInfo()}
      </HeartbeatInfo>

      <DeviceContent getProgressColor={getProgressColor} isMetricInAlert={isMetricInAlert} latestHeartbeat={latestHeartbeat} metricsConfig={metricsConfig} />

      <CardFooter>
        <LastUpdate>
          📅 Último: {formatDate(latestHeartbeat.createdAt)}
        </LastUpdate>
        
        <Readings>
          📊 {device.heartbeats.length} leituras
        </Readings>
        {hasAlerts && (
          <AlertIcon>
            ⚠️ {device.notifications.length} alerta(s)
          </AlertIcon>
        )}
      </CardFooter>
      <SeeMoreComponent deviceId={device.uuid} />
    </CardContainer>
  );
};

export default DeviceCard;