import { FastifyInstance } from 'fastify'
import { registerOrganisationController } from './register-org.controller'
import { authenticateOrganisationController } from './authenticate-org.controller'

export async function organisationRoutes(app:FastifyInstance){

	app.post('/organisations', registerOrganisationController)
	app.post('/sessions', authenticateOrganisationController)
}