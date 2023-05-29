import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetService } from '@/services/search-pet.service'
import { MayLiveWith, PetSize } from './register-pet.controller'

export type Filters = z.infer<typeof searchQuerySchema>

const searchQuerySchema = z.object({
	location: z.string(),
	name: z.string().optional(),
	pet_type: z.enum(['DOG', 'CAT']).optional(),
	age_min: z.coerce.number().optional(),
	age_max: z.coerce.number().optional(),
	sex: z.enum(['MALE', 'FEMALE']).optional(),
	size: z.union([z.array(z.nativeEnum(PetSize)),z.nativeEnum(PetSize)]).optional(),
	breed: z.array(z.string()).optional(),
	may_live_with: z.array(z.nativeEnum(MayLiveWith)).optional(),
	ideal_home: z.string().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).default(20),
})
export async function searchPetController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const filters = searchQuerySchema.parse(request.query)

	const petsRepository = new PrismaPetsRepository()
	const searchPetsService = new SearchPetService(petsRepository)

	const { pets } = await searchPetsService.searchPetService(filters)

	return reply.status(200).send({ pets })
}
