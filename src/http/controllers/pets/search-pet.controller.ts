import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetService } from '@/services/search-pet.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'

export type Filters = z.infer<typeof searchQuerySchema>

const searchQuerySchema = z.object({
	location: z.string(),
	name: z.string().optional(),
	pet_type:z.enum(['DOG','CAT']).optional(),
	age: z.coerce.number().optional(),
	sex:z.enum(['MALE','FEMALE']).nullable().optional(),
	size: z.enum(['TINY','SMALL','MEDIUM','LARGE','GIANT']).nullable().optional(),
	description: z.string().nullable().optional(),
	breed: z.string().nullable().optional(),
	may_live_with: z.string().nullable().optional(),
	ideal_home: z.string().nullable().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).default(20)
})
export async function searchPetController(request:FastifyRequest, reply: FastifyReply){

	const filters = searchQuerySchema.parse(request.query)


	const petsRepository = new PrismaPetsRepository()
	const searchPetsService = new SearchPetService(petsRepository)

	const {pets}= await searchPetsService.searchPetService(
		filters
	)
	

	return reply.status(200).send({pets})

}