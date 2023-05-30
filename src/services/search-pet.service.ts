import { Filters } from '@/http/controllers/pets/search-pet.controller'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'


export interface SearchPetServiceResponse{
    pets: Pet[]
	count: number
}

export class SearchPetService{
	constructor(private petsRepositry:PetsRepository){}
    
	async searchPetService(filters:Filters):Promise<SearchPetServiceResponse> {
	
		const {pets, count} = await this.petsRepositry.searchPets(filters)

		return {pets, count}
	}

}