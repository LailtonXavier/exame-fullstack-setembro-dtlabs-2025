import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repository/notification.repository';
import { NotificationGateway } from '../../infra/gateways/notification.gateway';
import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';

@Injectable()
export class NotificationEngineService {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly gateway: NotificationGateway,
  ) {}

  async processHeartbeat(heartbeat: Heartbeat, userId: string) {
    const heartbeatCurrent = await this.repo.findByUserId(userId);

    if (!heartbeatCurrent) return;

    for (const rule of heartbeatCurrent) {
      if (rule.deviceId && rule.deviceId !== heartbeat.deviceId) {
        continue;
      }

      const value = heartbeat[rule.metric as keyof Heartbeat] as number;

      if (this.evaluateCondition(value, rule.condition, rule.threshold)) {
        this.gateway.sendNotification(rule.userId, {
          message: `⚠️ Alerta: ${rule.metric} violou a regra`,
          metric: rule.metric,
          value,
          condition: rule.condition,
          threshold: rule.threshold,
          deviceId: heartbeat.deviceId,
          timestamp: new Date(),
        });
      }
    }
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '==': return value === threshold;
      default: return false;
    }
  }
}
