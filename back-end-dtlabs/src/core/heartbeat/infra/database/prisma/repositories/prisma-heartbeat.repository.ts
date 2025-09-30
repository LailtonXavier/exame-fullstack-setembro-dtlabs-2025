import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { HeartbeatRepository } from '@/core/heartbeat/domain/repository/heartbeat.repository';
import { Heartbeat } from '@/core/heartbeat/domain/entities/heartbeat.entity';

@Injectable()
export class PrismaHeartbeatRepository implements HeartbeatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(heartbeat: Heartbeat): Promise<Heartbeat> {
    const hb = await this.prisma.heartbeat.create({
      data: {
        id: heartbeat.id,
        deviceId: heartbeat.deviceId,
        cpuUsage: heartbeat.cpuUsage,
        ramUsage: heartbeat.ramUsage,
        diskFree: heartbeat.diskFree,
        temperature: heartbeat.temperature,
        latencyDns: heartbeat.latencyDns,
        connectivity: heartbeat.connectivity,
        bootTime: heartbeat.bootTime,
        createdAt: heartbeat.createdAt,
      },
    });

    return this.toDomain(hb);
  }

  async findByDeviceAndDateRange(
    deviceId: string,
    from?: Date,
    to?: Date
  ): Promise<Heartbeat[]> {
    const heartbeats = await this.prisma.heartbeat.findMany({
      where: {
        deviceId,
        ...(from && to ? { createdAt: { gte: from, lte: to } } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
  
    return heartbeats.map((h) => this.toDomain(h));
  }
  
  async findById(id: string): Promise<Heartbeat | null> {
    const heartbeat = await this.prisma.heartbeat.findUnique({ where: { id }})
    return heartbeat ? this.toDomain(heartbeat) : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.heartbeat.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error('Error when deleting:', error);
      return false;
    }
  }

  private toDomain(hb: any): Heartbeat {
    return new Heartbeat(
      hb.id,
      hb.deviceId,
      hb.cpuUsage,
      hb.ramUsage,
      hb.diskFree,
      hb.temperature,
      hb.latencyDns,
      hb.connectivity,
      hb.bootTime,
      hb.createdAt
    );
  }
}
