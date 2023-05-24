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
}