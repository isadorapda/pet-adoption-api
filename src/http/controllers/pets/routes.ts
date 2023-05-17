import { FastifyInstance } from 'fastify'
import { registerPetController } from './register-pet.controller'
import { searchPetController } from './search-pet.controller'

export async function petsRoutes(app:FastifyInstance){
	app.post('/organisations/:organisationId/pets', registerPetController)
	app.get('/pets', searchPetController)
}