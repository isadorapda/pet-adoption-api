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
			sex: data.sex ,
			size: data.size, 
			description: data.description ?? null,
			may_live_with: data.may_live_with,
			ideal_home: data.ideal_home ?? null ,
			breed: data.breed ?? null,
			age: data.age,
			adopted_at: data.adopted_at? new Date(data.adopted_at): null,
			organisation_id: data.organisation_id ?? randomUUID(),
		}
		this.pets.push(pet)
		return pet
	}
	async searchPets({location, page,limit,...petFilters}:Filters): Promise<{pets:Pet[],count:number}> {
		const org = await this.organisationRepository.findManyByCity(location)

		if(!org){
			return {pets:[],count:0}
		}
		const petsByCity = this.pets.filter((pet)=> {
			return org.find((org)=> org.id === pet.organisation_id)
		})
		if(!petFilters){
			return {pets:petsByCity,count:petsByCity.length}
		}
		const filterPets = () =>{
			const filtered:Pet[] = []

			petsByCity.forEach((pet)=>{
				if(((!petFilters.age_min || pet.age >= petFilters.age_min) &&  (!petFilters.age_max || pet.age <= petFilters.age_max))&&(!petFilters.pet_type|| pet.pet_type === petFilters.pet_type) && (!petFilters.sex || pet.sex === petFilters.sex)&& (!petFilters.name || pet.name.includes(petFilters.name))&&(!petFilters.breed || (pet.breed!==null&& petFilters.breed.includes(pet.breed))) && (!petFilters.size || petFilters.size.includes(pet.size))) {
					filtered.push(pet)
				}

			})
			return {pets:filtered.slice((page-1)*limit,page*limit), count:filtered.length}
		}

		return filterPets()
		
	}
	async findById(petId: string): Promise<Pet | null> {
		const pet = this.pets.find((pet)=> pet.id === petId)

		if(!pet) {
			return null
		}
		return pet
	}
	
	async save(data: Pet): Promise<Pet> {
		const petIndex = this.pets.findIndex((pet)=> pet.id === data.id)

		if(petIndex!==-1){
			this.pets[petIndex]=data
		}

		return data
	}
    
}