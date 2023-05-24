import 'dotenv/config'
import {z} from 'zod'

export const envSchema = z.object({
	NODE_ENV: z.enum(['production','test','development']).default('development'),
	PORT: z.coerce.number().default(3333),
	JWT_SECRET: z.string()
})

const _env = envSchema.safeParse(process.env)
console.log('ENV', _env)
if(_env.success === false){
	console.error('Invalid environment variable', console.error(_env.error.format()))
	throw new Error('Invalid environment variable')
}

export const env = _env.data