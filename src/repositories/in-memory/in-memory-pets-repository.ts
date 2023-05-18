import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { Filters } from '@/http/controllers/pets/search-pet.controller'
import { randomUUID } from 'node:crypto'
import { InMemoryOrganisationsRepository } from './in-memory-org-repository'

export class InMomoryPetsRepository implements PetsRepository{
	constructor(private organisationRepository:InMemoryOrganisationsRepository){}
	public pets:Pet[]=[]

	async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
		const pet = {
			id: data.id ?? randomUUID(),
			name: data.name,
			pet_type: data.pet_type,
			sex: data.sex ?? null,
			size: data.size ?? null,
			description: data.description ?? null,
			may_live_with: data.may_live_with ?? null,
			ideal_home: data.ideal_home ?? null,
			breed: data.breed ?? null,
			age: data.age ?? null,
			organisation_id: data.organisation_id ?? randomUUID(),
		}
		this.pets.push(pet)
		return pet
	}
	async searchPets({location, page,limit,...petFilters}:Filters): Promise<Pet[]> {
		const org = await this.organisationRepository.findManyByCity(location)

		if(!org){
			return []
		}
		const petsByCity = this.pets.filter((pet)=> {
			return org.find((org)=> org.id === pet.organisation_id)
		})
		if(!petFilters){
			return petsByCity
		}
		const filterPets = petsByCity.filter((pet)=> (!petFilters.age || pet.age === petFilters.age) && (!petFilters.breed || pet.breed === petFilters.breed)&& (!petFilters.pet_type|| pet.pet_type === petFilters.pet_type) && (!petFilters.sex || pet.sex === petFilters.sex) && (!petFilters.size || pet.size === petFilters.size) && (!petFilters.name || pet.name.includes(petFilters.name))).slice((page-1)*limit,page*limit)

		return filterPets
		
	}
	async findById(petId: string): Promise<Pet | null> {
		const pet = this.pets.find((pet)=> pet.id === petId)

		if(!pet) {
			return null
		}
		return pet
	}
	

    
}