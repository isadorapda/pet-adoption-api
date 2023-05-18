import { Filters } from '@/http/controllers/pets/search-pet.controller'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'


interface SearchPetServiceResponse{
    pets: Pet[]
}

export class SearchPetService{
	constructor(private petsRepositry:PetsRepository){}
    
	async searchPetService(filters:Filters):Promise<SearchPetServiceResponse> {

		const pets = await this.petsRepositry.searchPets(filters)

		return {pets}
	}

}