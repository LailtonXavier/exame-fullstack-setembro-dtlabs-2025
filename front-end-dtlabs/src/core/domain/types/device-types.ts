export type RegisterDeviceDto = {
  name: string;
	location: string;
	sn: string;
	description?: string | undefined;
}

export type UpdateDeviceDto = {
  name: string;
	location: string;
	description?: string | null;
}
