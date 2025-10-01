import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Info, ModalContainer, Title } from './styled';
import { useAuthStore } from '@/core/infra/store/authStore';

interface Notification {
  message: string;
  metric: string;
  value: number;
  condition: string;
  threshold: number;
  deviceId: string;
  timestamp: string;
}

interface NotificationAlertProps {
  token: string
}

const NotificationAlert = ({ token }: NotificationAlertProps) => {
  const { loadUserFromToken } = useAuthStore();

  const { notifications } = useSocket(token);
  const navigate = useNavigate();

  const [latest, setLatest] = useState<Notification | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const last = notifications[notifications.length - 1];
      setLatest(last);

      const timer = setTimeout(() => setLatest(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!latest) return null;

  const handleGoToDevice = () => {
    loadUserFromToken()

    navigate(`/devices/${latest.deviceId}`)
  }

  return (
    <ModalContainer>
      <Title>{latest.message}</Title>
      <Info>
        <strong>Métrica:</strong> {latest.metric} ({latest.value})
      </Info>
      <Info>
        <strong>Condição:</strong> {latest.condition} {latest.threshold}
      </Info>
      <Button onClick={handleGoToDevice}>
        Ver dispositivo
      </Button>
    </ModalContainer>
  );
};

export default NotificationAlert;
