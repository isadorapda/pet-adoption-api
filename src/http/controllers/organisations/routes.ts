import { FastifyInstance } from 'fastify'
import { registerOrganisationController } from './register-org.controller'
import { authenticateOrganisationController } from './authenticate-org.controller'
import { refresgAuthenticateOrganisationController } from './refresh-auth.controller'

export async function organisationRoutes(app:FastifyInstance){

	app.post('/organisations', registerOrganisationController)
	app.post('/sessions', authenticateOrganisationController)
	app.patch('/token/refresh', refresgAuthenticateOrganisationController)
}