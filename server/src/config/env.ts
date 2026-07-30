import 'dotenv/config';

import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().min(1).default('1h'),
  CORS_ORIGIN: z.string().url(),
});

export const env = environmentSchema.parse(process.env);
