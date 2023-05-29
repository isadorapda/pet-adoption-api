import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'
import { Filters } from '@/http/controllers/pets/search-pet.controller'

export class PrismaPetsRepository implements PetsRepository {


	async searchPets({
		location,
		page,
		limit,
		size,
		breed,
		may_live_with,
		age_min,
		age_max,
		...petFilters
	}: Filters): Promise<Pet[]> {
		return await prisma.pet.findMany({
			where: {
				organisation: {
					city: location,
				},
				size: {
					in: size,
				},
				breed:{
					in: breed,
				},
				may_live_with:{
					in: may_live_with,
				},
				
				age:{
					gte:age_min,
					lte:age_max,

				},
				...petFilters,
			},
			take: limit,
			skip: (page - 1) * limit,
		})
	}
	async findById(petId: string) {
		const pet = await prisma.pet.findUnique({
			where: {
				id: petId,
			},
		})
		return pet
	}

	async create(data: Prisma.PetUncheckedCreateInput) {
		const pet = await prisma.pet.create({
			data,
		})
		return pet
	}

	async save(data: Pet): Promise<Pet> {
		const pet = await prisma.pet.update({
			where:{
				id: data.id,
			},
			data,
		})
		return pet
	}
}