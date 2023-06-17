import { FastifyInstance } from 'fastify'
import { registerOrganisationController } from './register-org.controller'
import { authenticateOrganisationController } from './authenticate-org.controller'
import { refresgAuthenticateOrganisationController } from './refresh-auth.controller'
import { profileController } from './fetch-org-profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { fetchOrgController } from './fetch-org.controller'
import {  tagPetAsAdoptedController } from './tag-adopted-pet.controller'
import { editPetController } from './edit-pet.controller'
import { deletePetController } from './delete-pet.controller'
import { editOrganisationController } from './edit-organisation-profile.controller'
import { deleteOrganisationController } from './delete-organisation.controller'

export async function organisationRoutes(app:FastifyInstance){
	app.post('/organisations', registerOrganisationController)
	app.get('/organisations/:orgId', fetchOrgController)
	app.post('/sessions', authenticateOrganisationController)
	app.patch('/token/refresh', refresgAuthenticateOrganisationController)
	app.get('/me', {onRequest:[verifyJWT]}, profileController)
	app.patch('/me/pets/:petId', tagPetAsAdoptedController)
	app.patch('/me/pets/:petId/edit', editPetController)
	app.patch('/me/:orgId/edit', editOrganisationController)
	app.delete('/me/pets/:petId/delete', deletePetController)
	app.delete('/me/:orgId/delete', deleteOrganisationController)
}