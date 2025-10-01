export type RegisterNotificationDto = {
	userId: string;
	deviceId: string;
	metric: 'cpuUsage' | 'ramUsage' | 'diskFree' | 'temperature' | 'latencyDns';
  threshold: number;
	condition: '>' | '<' | '==';

}
