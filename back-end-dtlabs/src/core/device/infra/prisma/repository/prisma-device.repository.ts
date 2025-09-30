import { Injectable } from '@nestjs/common';
import { DeviceRepository } from '@/core/device/domain/repository/device.repository';
import { Device } from '@/core/device/domain/entities/device.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { CreateDeviceDtoType } from '@/core/device/application/dto/create-device.dto';

@Injectable()
export class PrismaDeviceRepository implements DeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(deviceData: CreateDeviceDtoType & { userId: string }): Promise<Device> {
    const device = await this.prisma.device.create({
      data: {
        name: deviceData.name,
        location: deviceData.location,
        sn: deviceData.sn,
        description: deviceData.description,
        userId: deviceData.userId,
      },
    });

    return this.toDomain(device);
  }

  async findBySn(sn: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({
      where: { sn },
    });

    return device ? this.toDomain(device) : null;
  }

  async findById(id: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({
      where: { uuid: id },
    });

    return device ? this.toDomain(device) : null;
  }

  async findByUserId(userId: string): Promise<Device[]> {
    const devices = await this.prisma.device.findMany({
      where: { userId },
    });

    return devices.map(device => this.toDomain(device));
  }

  async update(id: string, deviceData: Partial<Device>): Promise<Device> {
    const device = await this.prisma.device.update({
      where: { uuid: id },
      data: {
        name: deviceData.name,
        location: deviceData.location,
        description: deviceData.description,
        updated_at: new Date(),
      },
    });

    return this.toDomain(device);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.device.delete({
        where: { uuid: id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private toDomain(prismaDevice: any): Device {
    return new Device(
      prismaDevice.uuid,
      prismaDevice.name,
      prismaDevice.location,
      prismaDevice.sn,
      prismaDevice.description,
      prismaDevice.userId,
      prismaDevice.created_at,
      prismaDevice.updated_at
    );
  }
}