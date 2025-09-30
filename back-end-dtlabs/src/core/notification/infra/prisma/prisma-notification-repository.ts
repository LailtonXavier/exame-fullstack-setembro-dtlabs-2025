import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '@/core/notification/domain/repository/notification.repository';
import { Notification } from '@/core/notification/domain/entities/notification.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<Notification> {
    const created = await this.prisma.notification.create({
      data: {
        id: notification.id,
        userId: notification.userId,
        deviceId: notification.deviceId,
        metric: notification.metric,
        threshold: notification.threshold,
        condition: notification.condition,
        createdAt: notification.createdAt,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Notification | null> {
    const notifications = await this.prisma.notification.findUnique({
      where: { id },
    });

    return notifications ? notifications : null;
  }

  async findByUserId(userId: string): Promise<Notification[] | null> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map(n => this.toDomain(n));
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.notification.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(dbNotification: any): Notification {
    return new Notification(
      dbNotification.id,
      dbNotification.userId,
      dbNotification.deviceId,
      dbNotification.metric,
      dbNotification.threshold,
      dbNotification.condition,
      dbNotification.createdAt
    );
  }
}
