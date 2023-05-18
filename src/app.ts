import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { organisationRoutes } from './http/controllers/organisations/routes'
import { petsRoutes } from './http/controllers/pets/routes'
import fastifyJwt from '@fastify/jwt'
import { env } from './env'


export const app = fastify()
app.register(fastifyJwt,{
	secret: env.JWT_SECRET,
	cookie:{
		cookieName: 'refreshToken',
		signed:false
	},
	sign:{
		expiresIn: '10m',
	}
})
app.register(fastifyCookie)

app.register(organisationRoutes)
app.register(petsRoutes)