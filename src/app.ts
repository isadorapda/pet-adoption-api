import fastify from 'fastify'
import { organisationRoutes } from './http/controllers/organisations/routes'
import { petsRoutes } from './http/controllers/pets/routes'


export const app = fastify()

app.register(organisationRoutes)
app.register(petsRoutes)