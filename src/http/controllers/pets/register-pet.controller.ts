import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { RegisterPetService } from '@/services/register-pet.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function registerPetController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const registerPetParamsSchema = z.object({
		organisationId: z.string().uuid(),
	})

	const registerPetBodySchema = z.object({
		name: z.string(),
		pet_type: z.enum(['DOG', 'CAT']),
		age: z.coerce.number().positive().optional(),
		sex: z.enum(['MALE', 'FEMALE']).optional(),
		size: z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT']).optional(),
		description: z.string().optional(),
		breed: z.string().optional(),
		may_live_with: z.string().optional(),
		ideal_home: z.string().optional(),
	})

	const { organisationId } = registerPetParamsSchema.parse(request.params)

	const {
		name,
		age,
		breed,
		description,
		ideal_home,
		may_live_with,
		pet_type,
		sex,
		size,
	} = registerPetBodySchema.parse(request.body)

	const orgRepository = new PrismaOrganisationsRepository()
	const petRepository = new PrismaPetsRepository()
	const registerPetService = new RegisterPetService(
		orgRepository,
		petRepository
	)

	await registerPetService.registerPetService({
		organisationId,
		age,
		breed,
		description,
		ideal_home,
		may_live_with,
		pet_type,
		sex,
		size,
		name,
	})

	return reply.status(201).send()
}
