import { BadRequestException } from '@nestjs/common';

export function validateRequiredField<T>(field: string, value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new BadRequestException(`The '${field}' field is required.`);
  }
  return value;
}

export function validateRequiredFields(fields: Record<string, unknown>) {
  Object.entries(fields).forEach(([field, value]) => {
    validateRequiredField(field, value);
  });
}