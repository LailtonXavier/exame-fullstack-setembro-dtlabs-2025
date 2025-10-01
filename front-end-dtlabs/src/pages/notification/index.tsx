import { Divid } from '@/core/components/divid';
import { useAuthStore } from '@/core/infra/store/authStore';
import { formatDate } from '@/shared/utils/formatDate';
import { theme } from '@/styles/theme';
import { Plus } from 'lucide-react';
import { useState } from "react";
import { ContainerIconsNotification, NotificationContainer, NotificationContent, NotificationContentMain } from './styled';
import NotificationModal from '@/core/components/NotificationModal';
import { Device } from '@/core/domain/entities/device';

const Notification = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectDevice, setSelectDevice] = useState<Device>();
  const { user } = useAuthStore();
  const devices = user?.devices;

  const handleModalEndDevice = (device: Device) => {
    setIsModalOpen(prev => !prev)
    setSelectDevice(device)
  }

  return (
    <NotificationContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <h2>Notificações</h2>
      </div>

      {!isModalOpen && (
        <NotificationContentMain>
          {devices?.map((d) => {
            if (d.notifications.length > 0) {
              return (
                <NotificationContent key={d.uuid}>
                  <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                      <strong>Dispositivo: </strong>{d.name}
                    </div>
                    <ContainerIconsNotification onClick={() => handleModalEndDevice(d)}>
                      <Plus size={20} color={theme.colors.greenIconDark} />
                    </ContainerIconsNotification>
                  </div>
                  {d.notifications.map((n) => (
                    <div key={n.id}>
                      <Divid />
                        <strong>Métrica:</strong> {n.metric} <br />
                        <strong>Condição:</strong> {n.condition} {n.threshold} <br />
                        <strong>Criado em:</strong> {formatDate(n.createdAt)} <br />
                    </div>
                  ))}
                </NotificationContent>
              );
            }
            
            return (
              <NotificationContent key={d.uuid}>
                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <div>
                    <strong>Dispositivo: </strong>{d.name}
                  </div>
                  <ContainerIconsNotification onClick={() => handleModalEndDevice(d)}>
                    <Plus size={20} color={theme.colors.greenIconDark} />
                  </ContainerIconsNotification>
                </div>
                <div style={{ marginTop: '10px', textAlign: 'center', color: '#6b7280'}}>
                  ⚠️ Aguardando a primeira notificação...
                </div>
              </NotificationContent>
            );
          })}
        </NotificationContentMain>
      )}


      {isModalOpen && (
        <NotificationModal deviceName={selectDevice?.name} userId={selectDevice?.userId} deviceId={selectDevice?.uuid} onClose={() => setIsModalOpen(false)} />
      )}
    </NotificationContainer>
  );
};

export default Notification;