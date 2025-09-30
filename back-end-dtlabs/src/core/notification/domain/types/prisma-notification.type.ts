export type DomainNotificationProps = {
  id: string;
  userId: string;
  deviceId: string;
  metric: string;
  threshold: number;
  condition: string;
  createdAt: Date;
};