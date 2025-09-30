import { UserRepository } from '@/core/user/domain/repository/user.repository';
import { User } from '@/core/user/domain/entities/user.entity';
import { DomainUserProps, ReturnUser } from '@/core/user/domain/types/prisma-user.type';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Device } from '@/core/device/domain/entities/device.entity';
import { DomainDeviceProps } from '@/core/device/domain/types/prisma-device.type';
import { DomainNotificationProps } from '@/core/notification/domain/types/prisma-notification.type';
import { Notification as DomainNotification } from '@/core/notification/domain/entities/notification.entity';
import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';
import { DomainHeartbeatProps } from '@/core/heartbeat/domain/types/prisma-heartbeat';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id || undefined,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return new User(
      createdUser.id,
      createdUser.name,
      createdUser.email,
      createdUser.password,
    );
  }

  async update(id: string, user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        updatedAt: new Date(),
      },
    });
  
    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<ReturnUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        devices: {
          orderBy: {
            created_at: 'desc',
          },
          include: {
            heartbeats: true,
            notifications: true,
          },
        },
      },
    });
  
    return user ? this.toDomain(user) : null;
  }  

  private toDomain(
    user: DomainUserProps & {
      devices?: (DomainDeviceProps & {
        heartbeats?: DomainHeartbeatProps[];
        notifications?: DomainNotificationProps[];
      })[];
    }
  ): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.devices
        ? user.devices.map(d => {
            const heartbeats = d.heartbeats?.map(h => ({
              id: h.id,
              deviceId: h.deviceId,
              cpuUsage: h.cpuUsage,
              ramUsage: h.ramUsage,
              diskFree: h.diskFree,
              temperature: h.temperature,
              latencyDns: h.latencyDns,
              connectivity: h.connectivity,
              bootTime: h.bootTime,
              createdAt: h.createdAt,
            })) ?? [];
  
            const notifications = d.notifications?.map(n => ({
              id: n.id,
              userId: n.userId,
              deviceId: n.deviceId,
              metric: n.metric,
              threshold: n.threshold,
              condition: n.condition,
              createdAt: n.createdAt,
            })) ?? [];
  
            return new Device(
              d.uuid,
              d.name,
              d.location,
              d.sn,
              d.description || '',
              d.userId,
              d.created_at,
              d.updated_at,
              heartbeats.map(h => new Heartbeat(
                h.id,
                h.deviceId,
                h.cpuUsage,
                h.ramUsage,
                h.diskFree,
                h.temperature,
                h.latencyDns,
                h.connectivity,
                h.bootTime,
                h.createdAt
              )),
              notifications.map(n => new DomainNotification(
                n.id,
                n.userId,
                n.deviceId,
                n.metric,
                n.threshold,
                n.condition,
                n.createdAt
              )),
            );
          })
        : [],
    );
  }
  
  

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error when deleting:', error);
      return false;
    }
  }
  
}