import { FastifyInstance } from 'fastify'
import { registerOrganisationController } from './register-org.controller'
import { authenticateOrganisationController } from './authenticate-org.controller'
import { refresgAuthenticateOrganisationController } from './refresh-auth.controller'
import { profileController } from './fetch-org-profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { fetchOrgController } from './fetch-org.controller'
import {  tagPetAsAdoptedController } from './tag-adopted-pet.controller'

export async function organisationRoutes(app:FastifyInstance){
	app.post('/organisations', registerOrganisationController)
	app.get('/organisations/:orgId', fetchOrgController)
	app.post('/sessions', authenticateOrganisationController)
	app.patch('/token/refresh', refresgAuthenticateOrganisationController)
	app.get('/me', {onRequest:[verifyJWT]}, profileController)
	app.patch('/me/pets/:petId', tagPetAsAdoptedController)
}