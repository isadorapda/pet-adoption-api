import { FastifyInstance } from 'fastify'
import { registerPetController } from './register-pet.controller'
import { searchPetController } from './search-pet.controller'
import { getPetDetailsController } from './get-pet-details.controller'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app:FastifyInstance){
	app.post('/organisations/:organisationId/pets',{onRequest:[verifyJWT]} ,registerPetController)
	app.get('/pets/search', searchPetController)
	app.get('/pets/:petId/details', getPetDetailsController)
}