import { z } from 'zod';

// for Dart code generation

export const DeviceStatus = z.enum([
  'moving',
  'offline',
  'invalid',
  'expired',
  'idling',
  'online',
  'static',
  'overspeed',
]);

export const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.union([z.literal('admin'), z.literal('user')]),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.null(),
});
