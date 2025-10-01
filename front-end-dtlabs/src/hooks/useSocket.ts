import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  message: string;
  metric: string;
  value: number;
  condition: string;
  threshold: number;
  deviceId: string;
  timestamp: string;
}

export const useSocket = (token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const s = io('http://localhost:3000', {
      auth: { token },
    });

    s.on('connect', () => {
      console.log('✅ Connected to WS:', s.id);
    });

    s.on('notification', (notification: Notification) => {
      setNotifications(prev => [...prev, notification]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

  return { socket, notifications };
};
