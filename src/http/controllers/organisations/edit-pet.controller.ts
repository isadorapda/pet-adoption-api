import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { MayLiveWith } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PetSize } from '../pets/register-pet.controller'
import { EditPetService } from '@/services/edit-pet.service'

export async function editPetController(request:FastifyRequest, reply:FastifyReply){
	const editPetParamsSchema = z.object({
		petId: z.string().uuid(),
	})
	const editPetBodySchema = z.object({
		name: z.string().min(2).optional(),
		pet_type: z.enum(['DOG', 'CAT']).optional(),
		age: z.coerce.number().gt(0).optional(),
		sex: z.enum(['MALE', 'FEMALE']).optional(),
		size: z.nativeEnum(PetSize).optional(),
		description: z.string().max(1000).optional(),
		breed: z.string().optional(),
		may_live_with: z.nativeEnum(MayLiveWith).optional(),
		ideal_home: z.string().max(500).optional(),
	})

	const {petId} = editPetParamsSchema.parse(request.params)
	const bodySchema = editPetBodySchema.parse(request.body)

	const petRepository = new PrismaPetsRepository()
	const service = new EditPetService(petRepository )

	const {pet} =await service.editPetService({petId,...bodySchema})

	return reply.status(200).send({pet})
}