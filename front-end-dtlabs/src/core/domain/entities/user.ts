import { Device } from './device';

export interface User {
  id: string,
  name: string,
  email: string,
  password: string,
  devices?: Device[],
}