import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetService } from '@/services/search-pet.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'
export async function searchPetController(request:FastifyRequest, reply: FastifyReply){
	const searchQuerySchema = z.object({
		location: z.string(),
	})

	const {location} = searchQuerySchema.parse(request.query)


	const petsRepository = new PrismaPetsRepository()
	const searchPetsService = new SearchPetService(petsRepository)

	const {pets}= await searchPetsService.searchPetService({
		location
	})
	

	return reply.status(200).send({pets})

}