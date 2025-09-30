export class DeviceInUseError extends Error {
  constructor() {
    super('Device is already in use');
    this.name = 'DeviceInUseError';
  }
}
