import { Either, right } from '@/shared/core/validation';
import { randomUUID } from 'crypto';

export class Heartbeat {
  constructor(
    public readonly id: string,
    public readonly deviceId: string,
    public readonly cpuUsage: number,
    public readonly ramUsage: number,
    public readonly diskFree: number,
    public readonly temperature: number,
    public readonly latencyDns: number,
    public readonly connectivity: number,
    public readonly bootTime: Date,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    deviceId: string;
    cpuUsage: number;
    ramUsage: number;
    diskFree: number;
    temperature: number;
    latencyDns: number;
    connectivity: number;
    bootTime: Date;
  }): Either<Error, Heartbeat> {
    return right(
      new Heartbeat(
        randomUUID(),
        props.deviceId,
        props.cpuUsage,
        props.ramUsage,
        props.diskFree,
        props.temperature,
        props.latencyDns,
        props.connectivity,
        props.bootTime,
        new Date()
      )
    );
  }
}
