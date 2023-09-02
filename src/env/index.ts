import {config} from 'dotenv';
import {z} from 'zod';

if (process.env.NODE_ENV === 'production') {
  config();
} else {
  config({path: '.env.development'});
}

export const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'test', 'development']).default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_REGION: z.string(),
});

const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.info('aosi0pdjio0as', process.env);
  console.error('Invalid environment variable', console.error(_env.error.format()));
  throw new Error('Invalid environment variable');
}

export const env = _env.data;
