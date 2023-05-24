import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchPetService } from '@/services/search-pet.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'

export type Filters = z.infer<typeof searchQuerySchema>

export enum PetSize{
	TINY = 'TINY',
	SMALL = 'SMALL',
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
	GIANT = 'GIANT'
} 

const searchQuerySchema = z.object({
	location: z.string(),
	name: z.string().optional(),
	pet_type:z.enum(['DOG','CAT']).optional(),
	age: z.coerce.number().optional(),
	sex:z.enum(['MALE','FEMALE']).optional(),
	size: z.union([ z.array(z.nativeEnum(PetSize)), z.nativeEnum(PetSize)]).optional(),
	description: z.string().optional(),
	breed: z.string().optional(),
	may_live_with: z.string().optional(),
	ideal_home: z.string().optional(),
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