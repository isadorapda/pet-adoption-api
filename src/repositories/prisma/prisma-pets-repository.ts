import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository{
	async create(data: Prisma.PetUncheckedCreateInput){
		const pet = await prisma.pet.create({
			data
		})
		return pet
	}

	async findAllByLocation(location: string): Promise<Pet[]> {
		const pets =  await prisma.pet.findMany({where: {organisation: { city: location}}})
		return pets
	}

}