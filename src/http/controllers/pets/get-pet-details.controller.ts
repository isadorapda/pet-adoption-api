import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetDetailsService } from '@/services/get-pet-details.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'

export async function getPetDetailsController(request:FastifyRequest,reply: FastifyReply){

	const petDetailsParamsSchema = z.object({
		petId: z.string().uuid(),
	})

	const {petId} = petDetailsParamsSchema.parse(request.params)

	const petsRepository = new PrismaPetsRepository()
	const getPetDetailsService = new GetPetDetailsService(petsRepository)

	const {pet} =await getPetDetailsService.petDetailsService({
		petId,
	})

	return reply.status(200).send({pet})
}