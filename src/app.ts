import fastify from 'fastify'
import { organisationRoutes } from './http/controllers/organisations/routes'


export const app = fastify()

app.register(organisationRoutes)