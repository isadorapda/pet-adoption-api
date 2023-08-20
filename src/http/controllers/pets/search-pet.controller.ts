import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetService } from '@/services/search-pet.service'
import { MayLiveWith } from './register-pet.controller'

export type Filters = z.infer<typeof searchQuerySchema>

const searchQuerySchema = z.object({
	location: z.string(),
	name: z.string().optional(),
	pet_type: z.enum(['DOG', 'CAT']).optional(),
	age_min: z.coerce.number().optional(),
	age_max: z.coerce.number().optional(),
	sex: z.enum(['MALE', 'FEMALE']).optional(),
	size: z
		.union([
			z.array(z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT'])),
			z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT']),
		])
		.optional(),
	breed: z.union([z.array(z.string()), z.string()]).optional(),
	may_live_with: z
		.union([z.array(z.nativeEnum(MayLiveWith)), z.nativeEnum(MayLiveWith)])
		.optional(),
	ideal_home: z.string().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).default(20),
	field: z.string().default('created_at'),
	order: z.union([z.literal('asc'), z.literal('desc')]).default('desc'),
})
export async function searchPetController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const filters = searchQuerySchema.parse(request.query)

	const petsRepository = new PrismaPetsRepository()
	const searchPetsService = new SearchPetService(petsRepository)

	const { pets, count } = await searchPetsService.searchPetService(filters)
	return reply.status(200).send({ count, pets, page: filters.page })
}
