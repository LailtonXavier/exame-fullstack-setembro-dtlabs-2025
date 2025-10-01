import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash } from 'lucide-react';

import DeviceContent from '@/core/components/DeviceCard/components/DeviceContent';
import {
  AlertIndicator,
  DeviceDescription,
  LocationInfo,
} from '@/core/components/DeviceCard/styled';
import { ContainerIconsHeader } from '@/core/components/Header/styled';
import HeartbeatModal from '@/core/components/HeartbeatModal';
import { useAuthStore } from '@/core/infra/store/authStore';
import { useDeleteHeartbeat } from '@/hooks/useDeleteHeartbeat';
import { formatDate } from '@/shared/utils/formatDate';
import { metricsConfig } from '@/shared/utils/metricsConfig';
import { theme } from '@/styles/theme';
import {
  DeleteHeartbeatIcon,
  DeviceContentMain,
  DeviceDetailContainer,
  HeaderDetail,
} from './styled';
import GetHeartbeatFilter from './components/getHeartbeatFilter';
import { useHeartbeatStore } from '@/core/infra/store/heartbeatStore';

const DeviceDetail = () => {
  const { heartbeatFiltered } = useHeartbeatStore();
  const { mutate: deleteHeartbeat, isPending } = useDeleteHeartbeat();
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const device = user?.devices?.find((d) => d.uuid === id);

  const hasAlerts = !!device?.notifications?.length;

  const toggleShowModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const handleDeleteHeartbeat = useCallback(
    (heartbeatId: string) => {
      deleteHeartbeat(heartbeatId);
    },
    [deleteHeartbeat],
  );

  const isMetricInAlert = useCallback(
    (metricName: string, currentValue: number): boolean => {
      if (!device?.notifications) return false;

      return device.notifications.some((notif) => {
        switch (notif.condition) {
          case '>':
            return currentValue > notif.threshold;
          case '<':
            return currentValue < notif.threshold;
          case '==':
            return currentValue === notif.threshold;
          default:
            return false;
        }
      });
    },
    [device?.notifications],
  );

  const getProgressColor = useCallback(
    (value: number, metricName: string, maxValue: number): string => {
      const percentage = (value / maxValue) * 100;

      if (isMetricInAlert(metricName, value)) return '#ef4444';
      if (percentage > 80) return '#f59e0b';
      if (percentage > 60) return '#eab308';
      return '#22c55e';
    },
    [isMetricInAlert],
  );

  const heartbeatsToRender = useMemo(
    () =>
      (heartbeatFiltered?.length ? heartbeatFiltered : device?.heartbeats) ?? [],
    [heartbeatFiltered, device?.heartbeats],
  );

  if (!device) {
    return <p style={{ textAlign: 'center' }}>⚠️ Dispositivo não encontrado</p>;
  }

  return (
    <DeviceDetailContainer>
      <HeaderDetail>
        <div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <h2>Dispositivo: {device.name}</h2>
            {hasAlerts && <AlertIndicator>⚠️</AlertIndicator>}
          </div>
          <DeviceDescription>{device.description}</DeviceDescription>
          <LocationInfo>
            📍 {device.location} | SN: {device.sn}
          </LocationInfo>
        </div>
        <ContainerIconsHeader onClick={toggleShowModal}>
          <Plus size={30} color={theme.colors.greenIconDark} />
          Heartbeat
        </ContainerIconsHeader>
      </HeaderDetail>

      <GetHeartbeatFilter deviceId={device.uuid} />

      {showModal ? (
        <HeartbeatModal deviceId={device.uuid} onClose={toggleShowModal} />
      ) : heartbeatsToRender.length > 0 ? (
        heartbeatsToRender
          .slice()
          .reverse()
          .map((h, ind) => (
            <DeviceContentMain key={h.id}>
              <div className="subDiv">
                <h3>⏰ {formatDate(h.bootTime)}</h3>
                <p>
                  {ind + 1}/{heartbeatsToRender.length} 📊
                </p>
              </div>
              <DeviceContent
                metricsConfig={metricsConfig}
                getProgressColor={getProgressColor}
                isMetricInAlert={isMetricInAlert}
                latestHeartbeat={h}
              />
              <DeleteHeartbeatIcon
                onClick={() => handleDeleteHeartbeat(h.id)}
                disabled={isPending}
              >
                <Trash size={15} color="rgb(255, 255, 255)" />
                {isPending ? 'Deleting...' : 'Delete'}
              </DeleteHeartbeatIcon>
            </DeviceContentMain>
          ))
      ) : (
        <div
          style={{
            marginTop: '10px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          ⚠️ Aguardando primeiro heartbeat...
        </div>
      )}
    </DeviceDetailContainer>
  );
};

export default DeviceDetail;
