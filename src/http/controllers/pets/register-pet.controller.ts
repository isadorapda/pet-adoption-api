import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { RegisterPetService } from '@/services/register-pet.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export enum MayLiveWith {
  CATS = 'CATS',
  DOGS = 'DOGS',
  CHILDREN = 'CHILDREN',
  ELDER = 'ELDER',
  ANY = 'ANY',
}
export enum PetSize {
  TINY = 'TINY',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  GIANT = 'GIANT',
}

export async function registerPetController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const registerPetParamsSchema = z.object({
		organisationId: z.string().uuid(),
	})

	const registerPetBodySchema = z.object({
		name: z.string().min(2),
		pet_type: z.enum(['DOG', 'CAT']),
		age: z.coerce.number().gt(0),
		sex: z.enum(['MALE', 'FEMALE']),
		size: z.nativeEnum(PetSize),
		description: z.string().max(1000).optional(),
		breed: z.string().optional(),
		may_live_with: z.nativeEnum(MayLiveWith),
		ideal_home: z.string().max(500).optional(),
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
